export class DAOError extends Error {}

export enum ConstraintType {
  FOREIGNKEY = "FOREIGNKEY",
  UNIQUE = "UNIQUE",
}

export class DAOConstraintError extends DAOError {
  readonly type: ConstraintType;

  constructor(message: string, type: ConstraintType) {
    super(message);
    this.type = type;
  }
}

export class DAOConstraintUniqueError extends DAOConstraintError {
  readonly columnName: string;

  constructor(message: string, columnName: string) {
    super(message, ConstraintType.UNIQUE);
    this.columnName = columnName;
  }
}

export class DAOConstraintForeignKeyError extends DAOConstraintError {
  constructor(message: string) {
    super(message, ConstraintType.FOREIGNKEY);
  }
}
