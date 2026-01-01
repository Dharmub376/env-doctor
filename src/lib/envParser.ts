export interface ParsedEnvEntry {
  key: string;
  value: string;
  line: number;
  hasExport: boolean;
  isQuoted: boolean;
  quoteType?: 'single' | 'double';
  comment?: string;
}

export interface ParsedEnv {
  entries: ParsedEnvEntry[];
  duplicates: { key: string; lines: number[] }[];
  emptyValues: string[];
  comments: { line: number; content: string }[];
  blankLines: number[];
}

export class EnvParser {
  parse(content: string): ParsedEnv {
    const lines = content.split(/\r?\n/);
    const entries: ParsedEnvEntry[] = [];
    const comments: { line: number; content: string }[] = [];
    const blankLines: number[] = [];
    const keyTracker = new Map<string, number[]>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Handle blank lines
      if (line.trim() === '') {
        blankLines.push(lineNumber);
        continue;
      }

      // Handle comment-only lines
      if (line.trim().startsWith('#')) {
        comments.push({
          line: lineNumber,
          content: line.trim()
        });
        continue;
      }

      // Parse environment variable lines
      const parsed = this.parseLine(line, lineNumber);
      if (parsed) {
        entries.push(parsed);
        
        // Track duplicates
        if (!keyTracker.has(parsed.key)) {
          keyTracker.set(parsed.key, []);
        }
        keyTracker.get(parsed.key)!.push(lineNumber);
      }
    }

    // Find duplicates
    const duplicates = Array.from(keyTracker.entries())
      .filter(([_, lines]) => lines.length > 1)
      .map(([key, lines]) => ({ key, lines }));

    // Find empty values
    const emptyValues = entries
      .filter(entry => entry.value === '')
      .map(entry => entry.key);

    return {
      entries,
      duplicates,
      emptyValues,
      comments,
      blankLines
    };
  }

  private parseLine(line: string, lineNumber: number): ParsedEnvEntry | null {
    // Remove inline comments (but preserve # in quoted values)
    let workingLine = line;
    let comment: string | undefined;
    
    // Find comment that's not inside quotes
    let inQuotes = false;
    let quoteChar = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === '#' && !inQuotes) {
        comment = line.substring(i).trim();
        workingLine = line.substring(0, i).trim();
        break;
      }
    }

    // Check for export prefix
    const hasExport = workingLine.trim().startsWith('export ');
    if (hasExport) {
      workingLine = workingLine.replace(/^\s*export\s+/, '');
    }

    // Find the = sign
    const equalIndex = workingLine.indexOf('=');
    if (equalIndex === -1) {
      return null; // Not a valid env line
    }

    const key = workingLine.substring(0, equalIndex).trim();
    let value = workingLine.substring(equalIndex + 1);

    if (!key) {
      return null; // Empty key
    }

    // Handle quoted values
    let isQuoted = false;
    let quoteType: 'single' | 'double' | undefined;

    if (value.length >= 2) {
      const firstChar = value[0];
      const lastChar = value[value.length - 1];
      
      if ((firstChar === '"' && lastChar === '"') || 
          (firstChar === "'" && lastChar === "'")) {
        isQuoted = true;
        quoteType = firstChar === '"' ? 'double' : 'single';
        value = value.slice(1, -1);
        
        // Handle escape sequences in double quotes
        if (quoteType === 'double') {
          value = value
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\')
            .replace(/\\"/g, '"');
        }
      }
    }

    return {
      key,
      value,
      line: lineNumber,
      hasExport,
      isQuoted,
      quoteType,
      comment
    };
  }
}
