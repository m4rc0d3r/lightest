class SQLiteError extends Error {
  readonly code: string;
  readonly errno: number;

  constructor(message: string, code: string, errno: number) {
    super(message);
    this.code = code;
    this.errno = errno;
  }
}

enum ConstraintType {
  FOREIGNKEY = "FOREIGNKEY",
  UNIQUE = "UNIQUE",
}

class SQLiteConstraintError extends SQLiteError {
  readonly type: ConstraintType;

  constructor(message: string, code: string, errno: number, type: ConstraintType) {
    super(message, code, errno);
    this.type = type;
  }
}

class SQLiteConstraintUnique<T extends string> extends SQLiteConstraintError {
  readonly columnName: T;

  constructor(message: string, code: string, errno: number, columnName: T) {
    super(message, code, errno, ConstraintType.UNIQUE);
    this.columnName = columnName;
  }
}

class SQLiteConstraintForeignKey extends SQLiteConstraintError {
  constructor(message: string, code: string, errno: number) {
    super(message, code, errno, ConstraintType.FOREIGNKEY);
  }
}

export {
  ConstraintType,
  SQLiteConstraintError,
  SQLiteConstraintForeignKey,
  SQLiteConstraintUnique,
  SQLiteError,
};
