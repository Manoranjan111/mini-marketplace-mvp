class ApiResponse<T> {
  // Use generics for data type flexibility
  constructor(
    public readonly statusCode: number,
    public readonly data: T,
    public readonly message: string = "Success",
  ) {
    this.success = statusCode < 400;
  }

  public readonly success: boolean; // Make success property readonly
}

export { ApiResponse };
