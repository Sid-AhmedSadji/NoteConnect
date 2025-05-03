export default class Note {
    constructor({ _id = null, link, name, date = new Date(), isDead = false, modificationCount = 0, note = 0, liked = false, owner }) {
        if (!link) throw new Error("Invalid link: Link must be provided.");
        if (!name) throw new Error("Invalid name: Name must be provided.");
        if (!this.checkBoolean(isDead)) throw new Error("Invalid isDead: Must be a boolean value.");
        if (!this.checkInteger(modificationCount)) throw new Error("Invalid modificationCount: Must be an integer.");
        if (!this.checkInteger(note)) throw new Error("Invalid note: Must be an integer.");
        if (!this.checkBoolean(liked)) throw new Error("Invalid liked: Must be a boolean value.");
        if (!owner) throw new Error("Invalid owner: Owner must be provided.");
        this._id = _id;
        this.link = link;
        this.name = this.formateName(name);
        this.date = this.formateDate(date);
        this.isDead = isDead;
        this.modificationCount = modificationCount;
        this.note = note;
        this.liked = liked;
        this.owner = owner;
    }

    formateName(name) {
        if (typeof name !== 'string' || name.trim() === '') throw new Error("Invalid name: Must be a non-empty string.");
        const trimmedName = name.trim();
        return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();
    }

    checkInteger(value) {
        return typeof value === 'number' && Number.isInteger(value);
    }

    formateDate(value) {
        if (value instanceof Date)
            return value;
        try {
            return new Date(value);
        } catch (error) {
            throw new Error("Invalid date: Must be a valid date.");
        }
    }
    checkBoolean(value) {
        return typeof value === 'boolean';
    }

    updateNote(updatedFields) {
        const updatedNote = new Note({
            ...this.toJSON(),
            ...updatedFields,
            modificationCount: this.modificationCount + 1,
        });

        Object.assign(this, updatedNote);
    }

    toJSON() {
        return {
            _id: this._id,
            link: this.link,
            name: this.name,
            date: this.date,
            isDead: this.isDead,
            modificationCount: this.modificationCount,
            note: this.note,
            liked: this.liked,
            owner: this.owner,
        };
    }
}