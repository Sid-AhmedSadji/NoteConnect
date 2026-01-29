export default class Check {

  constructor({ _id, name, url, domain, method, success, isDead, chapter, error, durationMs, createdAt }) {
    this._id = _id;
    this.name = name;
    this.url = url;
    this.domain = domain;
    this.method = method;
    this.success = success;
    this.isDead = isDead
    this.chapter = chapter ?? null;
    this.error = error ?? null;
    this.durationMs = durationMs;
    this.createdAt = createdAt ?? new Date();
  }

  toJSON() {
    return {
      name: this.name,
      url: this.url,
      domain: this.domain,
      method: this.method,
      success: this.success,
      isDead: this.isDead,
      chapter: this.chapter,
      error: this.error,
      durationMs: this.durationMs,
      createdAt: this.createdAt,
    };
  }
}
