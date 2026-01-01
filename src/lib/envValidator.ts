import { ParsedEnv, ParsedEnvEntry } from './envParser';

export interface ValidationIssue {
  message: string;
  line: number;
  key?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface ValidationResults {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
}

export class EnvValidator {
  private readonly frameworkKeys = {
    node: ['NODE_ENV', 'PORT'],
    nextjs: ['NEXT_PUBLIC_', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
    vite: ['VITE_'],
    convex: ['DATABASE_URL', 'PRISMA_'],
    firebase: ['FIREBASE_', 'NEXT_PUBLIC_FIREBASE_'],
    stripe: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
    vercel: ['VERCEL_URL', 'VERCEL_ENV'],
    supabase: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  };

  private readonly commonSecrets = [
    'API_KEY', 'SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE_KEY', 'CLIENT_SECRET'
  ];

  validate(parsed: ParsedEnv): ValidationResults {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const suggestions: ValidationIssue[] = [];

    // Check for duplicates
    parsed.duplicates.forEach(duplicate => {
      errors.push({
        message: `Duplicate key "${duplicate.key}" found on lines: ${duplicate.lines.join(', ')}`,
        line: duplicate.lines[0],
        key: duplicate.key,
        severity: 'error'
      });
    });

    // Validate each entry
    parsed.entries.forEach(entry => {
      this.validateEntry(entry, errors, warnings, suggestions);
    });

    // Check for missing common keys
    this.checkMissingKeys(parsed, warnings, suggestions);

    // Check for framework-specific issues
    this.checkFrameworkIssues(parsed, warnings, suggestions);

    return { errors, warnings, suggestions };
  }

  private validateEntry(
    entry: ParsedEnvEntry,
    errors: ValidationIssue[],
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const { key, value, line } = entry;

    // Check for empty values
    if (value === '') {
      warnings.push({
        message: `Empty value for "${key}"`,
        line,
        key,
        severity: 'warning'
      });
    }

    // Check for placeholder values
    if (this.isPlaceholderValue(value)) {
      errors.push({
        message: `Placeholder value detected for "${key}": "${value}"`,
        line,
        key,
        severity: 'error'
      });
    }

    // Validate specific key patterns
    this.validateKeyPatterns(entry, errors, warnings, suggestions);

    // Check for insecure secrets
    this.validateSecrets(entry, warnings, suggestions);

    // Validate URLs
    if (this.isUrlKey(key)) {
      this.validateUrl(entry, errors, warnings);
    }

    // Validate boolean values
    if (this.isBooleanKey(key)) {
      this.validateBoolean(entry, warnings, suggestions);
    }

    // Validate numeric values
    if (this.isNumericKey(key)) {
      this.validateNumeric(entry, warnings);
    }

    // Validate JSON values
    if (this.isJsonKey(key)) {
      this.validateJson(entry, errors, warnings);
    }
  }

  private isPlaceholderValue(value: string): boolean {
    const placeholders = [
      'your-', 'replace-', 'change-', 'update-', 'add-your-',
      'example', 'placeholder', 'todo', 'fixme', 'xxx', 'yyy',
      'test123', 'password123', 'secret123'
    ];

    const lowerValue = value.toLowerCase();
    return placeholders.some(placeholder => lowerValue.includes(placeholder));
  }

  private validateKeyPatterns(
    entry: ParsedEnvEntry,
    errors: ValidationIssue[],
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const { key, value, line } = entry;

    // Check NODE_ENV values
    if (key === 'NODE_ENV') {
      const validValues = ['development', 'production', 'test'];
      if (!validValues.includes(value)) {
        warnings.push({
          message: `NODE_ENV should be one of: ${validValues.join(', ')}. Found: "${value}"`,
          line,
          key,
          severity: 'warning'
        });
      }
    }

    // Check PORT
    if (key === 'PORT') {
      const port = parseInt(value, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        errors.push({
          message: `PORT must be a valid number between 1-65535. Found: "${value}"`,
          line,
          key,
          severity: 'error'
        });
      } else if (port < 1024) {
        warnings.push({
          message: `PORT ${port} is a privileged port. Consider using a port >= 1024`,
          line,
          key,
          severity: 'warning'
        });
      }
    }

    // Check public keys in Next.js
    if (key.startsWith('NEXT_PUBLIC_') && this.containsSecret(value)) {
      errors.push({
        message: `Public environment variable "${key}" appears to contain sensitive data`,
        line,
        key,
        severity: 'error'
      });
    }

    // Check Vite public keys
    if (key.startsWith('VITE_') && this.containsSecret(value)) {
      errors.push({
        message: `Vite environment variable "${key}" will be exposed to the client`,
        line,
        key,
        severity: 'error'
      });
    }
  }

  private validateSecrets(
    entry: ParsedEnvEntry,
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const { key, value, line } = entry;

    if (this.isSecretKey(key)) {
      // Check for weak secrets
      if (value.length < 16) {
        warnings.push({
          message: `Secret "${key}" is too short (${value.length} chars). Consider using at least 16 characters`,
          line,
          key,
          severity: 'warning'
        });
      }

      // Check for common weak patterns
      if (/^(123|abc|test|demo|admin)/i.test(value)) {
        warnings.push({
          message: `Secret "${key}" appears to use a weak or test value`,
          line,
          key,
          severity: 'warning'
        });
      }

      // Check for base64 encoding suggestion
      if (!/^[A-Za-z0-9+/=]+$/.test(value) && value.length > 20) {
        suggestions.push({
          message: `Consider base64 encoding the secret "${key}" for better compatibility`,
          line,
          key,
          severity: 'info'
        });
      }
    }
  }

  private validateUrl(
    entry: ParsedEnvEntry,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ) {
    const { key, value, line } = entry;

    try {
      const url = new URL(value);

      // Check for localhost in production-like keys
      if (this.isProductionKey(key) && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
        warnings.push({
          message: `Production URL "${key}" points to localhost`,
          line,
          key,
          severity: 'warning'
        });
      }

      // Check for HTTP in production
      if (this.isProductionKey(key) && url.protocol === 'http:' && url.hostname !== 'localhost') {
        warnings.push({
          message: `Production URL "${key}" uses HTTP instead of HTTPS`,
          line,
          key,
          severity: 'warning'
        });
      }

      // Check for missing credentials in database URLs
      if (key.includes('DATABASE_URL') && !url.username && !url.password) {
        warnings.push({
          message: `Database URL "${key}" is missing credentials`,
          line,
          key,
          severity: 'warning'
        });
      }

    } catch (error) {
      errors.push({
        message: `Invalid URL format for "${key}": ${value}`,
        line,
        key,
        severity: 'error'
      });
    }
  }

  private validateBoolean(
    entry: ParsedEnvEntry,
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const { key, value, line } = entry;
    const validBooleans = ['true', 'false', '1', '0', 'yes', 'no'];

    if (!validBooleans.includes(value.toLowerCase())) {
      warnings.push({
        message: `Boolean value for "${key}" should be one of: ${validBooleans.join(', ')}. Found: "${value}"`,
        line,
        key,
        severity: 'warning'
      });
    }

    if (value === 'True' || value === 'False') {
      suggestions.push({
        message: `Use lowercase for boolean "${key}": "${value.toLowerCase()}"`,
        line,
        key,
        severity: 'info'
      });
    }
  }

  private validateNumeric(entry: ParsedEnvEntry, warnings: ValidationIssue[]) {
    const { key, value, line } = entry;

    if (isNaN(Number(value))) {
      warnings.push({
        message: `Numeric value expected for "${key}". Found: "${value}"`,
        line,
        key,
        severity: 'warning'
      });
    }
  }

  private validateJson(entry: ParsedEnvEntry, errors: ValidationIssue[], warnings: ValidationIssue[]) {
    const { key, value, line } = entry;

    try {
      JSON.parse(value);
    } catch (error) {
      errors.push({
        message: `Invalid JSON format for "${key}"`,
        line,
        key,
        severity: 'error'
      });
    }
  }

  private checkMissingKeys(
    parsed: ParsedEnv,
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const existingKeys = new Set(parsed.entries.map(e => e.key));

    // Check for NODE_ENV
    if (!existingKeys.has('NODE_ENV')) {
      suggestions.push({
        message: 'Consider adding NODE_ENV to specify the environment (development, production, test)',
        line: 0,
        severity: 'info'
      });
    }

    // Check for common missing pairs
    if (existingKeys.has('STRIPE_SECRET_KEY') && !existingKeys.has('STRIPE_PUBLISHABLE_KEY')) {
      warnings.push({
        message: 'STRIPE_SECRET_KEY found but STRIPE_PUBLISHABLE_KEY is missing',
        line: 0,
        severity: 'warning'
      });
    }
  }

  private checkFrameworkIssues(
    parsed: ParsedEnv,
    warnings: ValidationIssue[],
    suggestions: ValidationIssue[]
  ) {
    const existingKeys = new Set(parsed.entries.map(e => e.key));

    // Detect framework usage
    const hasNextPublic = Array.from(existingKeys).some(key => key.startsWith('NEXT_PUBLIC_'));
    const hasVite = Array.from(existingKeys).some(key => key.startsWith('VITE_'));
    const hasConvex = Array.from(existingKeys).some(key => key.includes('DATABASE_URL') || key.startsWith('PRISMA_'));

    if (hasNextPublic && !existingKeys.has('NEXTAUTH_SECRET')) {
      suggestions.push({
        message: 'Next.js app detected. Consider adding NEXTAUTH_SECRET for authentication',
        line: 0,
        severity: 'info'
      });
    }

    if (hasConvex && !existingKeys.has('DATABASE_URL')) {
      warnings.push({
        message: 'Convex usage detected but DATABASE_URL is missing',
        line: 0,
        severity: 'warning'
      });
    }
  }

  private isUrlKey(key: string): boolean {
    return key.includes('URL') || key.includes('ENDPOINT') || key.includes('HOST');
  }

  private isBooleanKey(key: string): boolean {
    const booleanPatterns = ['ENABLE', 'DISABLE', 'DEBUG', 'VERBOSE', 'STRICT'];
    return booleanPatterns.some(pattern => key.includes(pattern));
  }

  private isNumericKey(key: string): boolean {
    const numericPatterns = ['PORT', 'TIMEOUT', 'LIMIT', 'SIZE', 'COUNT', 'MAX', 'MIN'];
    return numericPatterns.some(pattern => key.includes(pattern));
  }

  private isJsonKey(key: string): boolean {
    const jsonPatterns = ['CONFIG', 'CREDENTIALS', 'FIREBASE_CONFIG'];
    return jsonPatterns.some(pattern => key.includes(pattern));
  }

  private isSecretKey(key: string): boolean {
    return this.commonSecrets.some(secret => key.includes(secret));
  }

  private isProductionKey(key: string): boolean {
    return key.includes('PROD') || key.includes('PRODUCTION') ||
      (!key.includes('DEV') && !key.includes('TEST') && !key.includes('LOCAL'));
  }

  private containsSecret(value: string): boolean {
    // Simple heuristic to detect if a value might be sensitive
    return value.length > 20 && /[A-Za-z0-9+/=]{20,}/.test(value);
  }
}
