class DAOError extends Error {}

enum ConstraintType {
  FOREIGNKEY = "FOREIGNKEY",
  UNIQUE = "UNIQUE",
}

class DAOConstraintError extends DAOError {
  readonly type: ConstraintType;

  constructor(message: string, type: ConstraintType) {
    super(message);
    this.type = type;
  }
}

class DAOConstraintUniqueError extends DAOConstraintError {
  readonly columnName: string;

  constructor(message: string, columnName: string) {
    super(message, ConstraintType.UNIQUE);
    this.columnName = columnName;
  }
}

class DAOConstraintForeignKeyError extends DAOConstraintError {
  constructor(message: string) {
    super(message, ConstraintType.FOREIGNKEY);
  }
}

export {
  ConstraintType,
  DAOConstraintError,
  DAOConstraintForeignKeyError,
  DAOConstraintUniqueError,
  DAOError,
};
