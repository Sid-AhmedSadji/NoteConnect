export default class Note {

    static FIELD_RULES = {
        link: {
            required: true,
            validate: v => typeof v === 'string' && /^(https?:\/\/)/.test(v),
            error: 'Invalid link'
        },
        name: {
            required: true,
            transform: v => Note.formatName(v),
            validate: v => typeof v === 'string' && v.trim().length > 0,
            error: 'Invalid name'
        },
        date: {
            default: () => new Date(),
            validate: v => v instanceof Date && !isNaN(v)
        },
        isDead: {
            default: false,
            validate: v => typeof v === 'boolean'
        },
        modificationCount: {
            default: 0,
            validate: v => Number.isInteger(v) && v >= 0
        },
        note: {
            default: 0,
            validate: v => typeof v === 'number' && v >= 0 && v <= 100
        },
        liked: {
            default: false,
            validate: v => typeof v === 'boolean'
        },
        owner: {
            required: true,
            validate: v => !!v,
            error: 'Invalid owner'
        },
        domain: {
            derive: obj => Note.extractDomain(obj.link),
            validate: v => v === null || typeof v === 'string'
        },
        chapter: {
            default: null,
            validate: v => v === null || Number.isInteger(v)
        },
        chapterSource: {
            default: 'unknown',
            validate: v => ['url', 'html', 'manual', 'user', 'unknown'].includes(v)
        }
    };

    constructor(input) {
        if (!input || typeof input !== 'object') {
            throw new Error('Invalid Note payload');
        }

        this._id = input._id ?? null;

        for (const [field, rules] of Object.entries(Note.FIELD_RULES)) {

            let value =
                input[field] ??
                (rules.derive ? rules.derive(input)
                : typeof rules.default === 'function'
                    ? rules.default()
                    : rules.default);

            if (rules.required && value === undefined) {
                throw new Error(rules.error || `Missing field: ${field}`);
            }

            if (rules.transform) {
                value = rules.transform(value);
            }

            if (rules.validate && !rules.validate(value)) {
                throw new Error(rules.error || `Invalid field: ${field}`);
            }

            this[field] = value;
        }
    }

    /* ===== Helpers ===== */

    static formatName(name) {
        let formatted = name.trim().replace(/[^a-zA-Z0-9&]+/g, '_');
        formatted = formatted.replace(/_{2,}/g, '_').replace(/_$/, '');
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    static extractDomain(link) {
        try {
            return new URL(link).hostname;
        } catch {
            return null;
        }
    }

    /* ===== Business logic ===== */

    updateNote(updatedFields) {
        return new Note({
            ...this.toJSON(),
            ...updatedFields,
            modificationCount: this.modificationCount + 1,
            date: new Date(),
            isDead: false
        });
    }

    toJSON() {
        return Object.fromEntries(
            Object.keys(Note.FIELD_RULES).map(k => [k, this[k]])
        );
    }
}
