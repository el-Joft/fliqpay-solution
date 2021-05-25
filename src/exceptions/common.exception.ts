import HttpException from "./httpException";

class commonException extends HttpException {
  constructor(message: string, status: number) {
    super(status, message);
  }
}

export default commonException;
