export class BadRequest extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
    }
}

export class NotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFound";
    }
}

export class Unauthorized extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Unauthorized";
    }
}

export class Forbidden extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Forbidden";
    }
}

export class UserAlreadyExists extends Error {
  constructor(message: string) {
      super(message);
      this.name = "UserAlreadyExists";
  }
}

