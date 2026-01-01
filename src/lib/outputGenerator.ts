import { ParsedEnv, ParsedEnvEntry } from './envParser';
import { ValidationResults } from './envValidator';

export interface GeneratedOutputs {
  envExample: string;
  deploymentChecklist: string;
  dockerCompose?: string;
  vercelConfig?: string;
}

export class OutputGenerator {
  generate(parsed: ParsedEnv, validation: ValidationResults): GeneratedOutputs {
    const envExample = this.generateEnvExample(parsed);
    const deploymentChecklist = this.generateDeploymentChecklist(parsed, validation);
    const dockerCompose = this.generateDockerCompose(parsed);
    const vercelConfig = this.generateVercelConfig(parsed);

    return {
      envExample,
      deploymentChecklist,
      dockerCompose,
      vercelConfig
    };
  }

  private generateEnvExample(parsed: ParsedEnv): string {
    const lines: string[] = [];

    lines.push('# Environment Variables Template');
    lines.push('# Copy this file to .env and fill in your actual values');
    lines.push('# Never commit .env files to version control!');
    lines.push('');

    // Group entries by category
    const categories = this.categorizeEntries(parsed.entries);

    Object.entries(categories).forEach(([category, entries]) => {
      if (entries.length === 0) return;

      lines.push(`# ${category}`);
      entries.forEach(entry => {
        const comment = this.generateKeyComment(entry);
        if (comment) {
          lines.push(`# ${comment}`);
        }

        const exampleValue = this.generateExampleValue(entry);
        lines.push(`${entry.key}=${exampleValue}`);
      });
      lines.push('');
    });

    return lines.join('\n').trim();
  }

  private generateDeploymentChecklist(parsed: ParsedEnv, validation: ValidationResults): string {
    const lines: string[] = [];
    const existingKeys = new Set(parsed.entries.map(e => e.key));

    lines.push('# Deployment Checklist');
    lines.push('');

    // Environment-specific checks
    lines.push('## Environment Configuration');
    lines.push('- [ ] NODE_ENV is set to "production" in production');
    lines.push('- [ ] All placeholder values have been replaced with real values');
    lines.push('- [ ] Database URLs point to production databases');
    lines.push('- [ ] API endpoints use HTTPS in production');
    lines.push('- [ ] Secrets are properly generated and secure');
    lines.push('');

    // Framework-specific checks
    const frameworks = this.detectFrameworks(existingKeys);
    if (frameworks.length > 0) {
      lines.push('## Framework-Specific Checks');
      frameworks.forEach(framework => {
        const checks = this.getFrameworkChecks(framework, existingKeys);
        checks.forEach(check => lines.push(`- [ ] ${check}`));
      });
      lines.push('');
    }

    // Platform-specific deployment notes
    lines.push('## Platform Deployment Notes');
    lines.push('');

    lines.push('### Vercel');
    lines.push('- Add environment variables in Project Settings > Environment Variables');
    lines.push('- Use different values for Preview and Production environments');
    lines.push('- NEXT_PUBLIC_ variables are exposed to the client');
    lines.push('');

    lines.push('### Docker');
    lines.push('- Use --env-file flag: `docker run --env-file .env your-image`');
    lines.push('- Or use docker-compose.yml with env_file directive');
    lines.push('- Never include .env in Docker images');
    lines.push('');

    lines.push('### Railway/Render/Heroku');
    lines.push('- Set environment variables in the platform dashboard');
    lines.push('- Use config vars instead of .env files');
    lines.push('- Some platforms auto-set PORT variable');
    lines.push('');

    // Security reminders
    lines.push('## Security Checklist');
    lines.push('- [ ] .env files are in .gitignore');
    lines.push('- [ ] No secrets in public environment variables');
    lines.push('- [ ] Database credentials are properly secured');
    lines.push('- [ ] API keys have appropriate permissions/scopes');
    lines.push('- [ ] Secrets are rotated regularly');
    lines.push('');

    // Validation issues
    if (validation.errors.length > 0 || validation.warnings.length > 0) {
      lines.push('## Issues to Address');
      validation.errors.forEach(error => {
        lines.push(`- [ ] ERROR: ${error.message}`);
      });
      validation.warnings.forEach(warning => {
        lines.push(`- [ ] WARNING: ${warning.message}`);
      });
      lines.push('');
    }

    return lines.join('\n').trim();
  }

  private generateDockerCompose(parsed: ParsedEnv): string {
    const lines: string[] = [];

    lines.push('# docker-compose.yml');
    lines.push('version: "3.8"');
    lines.push('');
    lines.push('services:');
    lines.push('  app:');
    lines.push('    build: .');
    lines.push('    ports:');

    const portEntry = parsed.entries.find(e => e.key === 'PORT');
    const port = portEntry ? portEntry.value : '3000';
    lines.push(`      - "${port}:${port}"`);

    lines.push('    env_file:');
    lines.push('      - .env');
    lines.push('    environment:');
    lines.push('      - NODE_ENV=production');

    // Add database service if DATABASE_URL is present
    const dbUrl = parsed.entries.find(e => e.key === 'DATABASE_URL');
    if (dbUrl && dbUrl.value.includes('postgresql')) {
      lines.push('');
      lines.push('  postgres:');
      lines.push('    image: postgres:15');
      lines.push('    environment:');
      lines.push('      - POSTGRES_DB=myapp');
      lines.push('      - POSTGRES_USER=user');
      lines.push('      - POSTGRES_PASSWORD=password');
      lines.push('    volumes:');
      lines.push('      - postgres_data:/var/lib/postgresql/data');
      lines.push('');
      lines.push('volumes:');
      lines.push('  postgres_data:');
    }

    return lines.join('\n');
  }

  private generateVercelConfig(parsed: ParsedEnv): string {
    const lines: string[] = [];

    lines.push('# vercel.json');
    lines.push('{');
    lines.push('  "env": {');

    const nonPublicEntries = parsed.entries.filter(e =>
      !e.key.startsWith('NEXT_PUBLIC_') && !e.key.startsWith('VITE_')
    );

    nonPublicEntries.forEach((entry, index) => {
      const isLast = index === nonPublicEntries.length - 1;
      lines.push(`    "${entry.key}": "@${entry.key.toLowerCase()}"${isLast ? '' : ','}`);
    });

    lines.push('  }');
    lines.push('}');
    lines.push('');
    lines.push('# Add these as environment variables in Vercel dashboard:');
    nonPublicEntries.forEach(entry => {
      lines.push(`# ${entry.key}=your-actual-value`);
    });

    return lines.join('\n');
  }

  private categorizeEntries(entries: ParsedEnvEntry[]): Record<string, ParsedEnvEntry[]> {
    const categories: Record<string, ParsedEnvEntry[]> = {
      'Application': [],
      'Database': [],
      'Authentication': [],
      'External APIs': [],
      'Framework': [],
      'Other': []
    };

    entries.forEach(entry => {
      const key = entry.key.toLowerCase();

      if (key.includes('database') || key.includes('db_') || key === 'database_url') {
        categories['Database'].push(entry);
      } else if (key.includes('auth') || key.includes('jwt') || key.includes('session')) {
        categories['Authentication'].push(entry);
      } else if (key.includes('api_key') || key.includes('stripe') || key.includes('firebase') ||
        key.includes('openai') || key.includes('sendgrid')) {
        categories['External APIs'].push(entry);
      } else if (key.startsWith('next_') || key.startsWith('vite_') || key.startsWith('react_')) {
        categories['Framework'].push(entry);
      } else if (key === 'node_env' || key === 'port' || key.includes('host')) {
        categories['Application'].push(entry);
      } else {
        categories['Other'].push(entry);
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  }

  private generateKeyComment(entry: ParsedEnvEntry): string {
    const key = entry.key;

    const comments: Record<string, string> = {
      'NODE_ENV': 'Environment: development, production, or test',
      'PORT': 'Port number for the application server',
      'DATABASE_URL': 'Database connection string',
      'JWT_SECRET': 'Secret key for JWT token signing',
      'API_KEY': 'API key for external service',
      'NEXTAUTH_SECRET': 'Secret for NextAuth.js session encryption',
      'NEXTAUTH_URL': 'Canonical URL of your site',
      'STRIPE_SECRET_KEY': 'Stripe secret key (keep private)',
      'STRIPE_PUBLISHABLE_KEY': 'Stripe publishable key (safe for client)',
    };

    if (comments[key]) {
      return comments[key];
    }

    // Generate generic comments based on patterns
    if (key.includes('SECRET') || key.includes('PRIVATE')) {
      return 'Keep this secret and secure';
    }
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_')) {
      return 'This will be exposed to the client';
    }
    if (key.includes('URL') || key.includes('ENDPOINT')) {
      return 'Service endpoint URL';
    }

    return '';
  }

  private generateExampleValue(entry: ParsedEnvEntry): string {
    const key = entry.key;

    // Don't expose actual secrets
    if (this.isSecretKey(key)) {
      return 'your-secret-key-here';
    }

    // Generate appropriate example values
    if (key === 'NODE_ENV') return 'production';
    if (key === 'PORT') return '3000';
    if (key.includes('DATABASE_URL')) return 'postgresql://user:password@localhost:5432/database';
    if (key.includes('REDIS_URL')) return 'redis://localhost:6379';
    if (key.includes('MONGODB_URI')) return 'mongodb://localhost:27017/database';
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('VITE_')) return 'your-public-value';
    if (key.includes('URL') || key.includes('ENDPOINT')) return 'https://api.example.com';
    if (key.includes('HOST')) return 'localhost';
    if (key.includes('TIMEOUT')) return '5000';
    if (key.includes('LIMIT')) return '100';

    return 'your-value-here';
  }

  private detectFrameworks(keys: Set<string>): string[] {
    const frameworks: string[] = [];

    if (Array.from(keys).some(key => key.startsWith('NEXT_'))) {
      frameworks.push('Next.js');
    }
    if (Array.from(keys).some(key => key.startsWith('VITE_'))) {
      frameworks.push('Vite');
    }
    if (Array.from(keys).some(key => key.includes('PRISMA') || key === 'DATABASE_URL')) {
      frameworks.push('Convex');
    }
    if (Array.from(keys).some(key => key.includes('FIREBASE'))) {
      frameworks.push('Firebase');
    }
    if (Array.from(keys).some(key => key.includes('STRIPE'))) {
      frameworks.push('Stripe');
    }

    return frameworks;
  }

  private getFrameworkChecks(framework: string, keys: Set<string>): string[] {
    const checks: Record<string, string[]> = {
      'Next.js': [
        'NEXT_PUBLIC_ variables are properly prefixed for client exposure',
        'NEXTAUTH_SECRET is set for authentication',
        'NEXTAUTH_URL matches your domain in production'
      ],
      'Vite': [
        'VITE_ variables are properly prefixed for client exposure',
        'No sensitive data in VITE_ prefixed variables'
      ],
      'Convex': [
        'DATABASE_URL is properly formatted',
        'Database is accessible from deployment environment',
        'Convex migrations are run in production'
      ],
      'Firebase': [
        'Firebase config is properly structured',
        'Service account keys are secure',
        'Firebase rules are configured for production'
      ],
      'Stripe': [
        'Using correct Stripe keys for environment (test vs live)',
        'Webhook endpoints are configured',
        'Stripe publishable key matches secret key environment'
      ]
    };

    return checks[framework] || [];
  }

  private isSecretKey(key: string): boolean {
    const secretPatterns = ['SECRET', 'PRIVATE', 'KEY', 'TOKEN', 'PASSWORD'];
    return secretPatterns.some(pattern => key.includes(pattern)) &&
      !key.startsWith('NEXT_PUBLIC_') &&
      !key.startsWith('VITE_');
  }
}
