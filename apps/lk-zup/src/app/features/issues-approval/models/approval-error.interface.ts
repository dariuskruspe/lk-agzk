export interface ApprovalErrorInterface {
  error: {
    errorMsg: string;
    toast: {
      message: {
        header: string;
        text: string;
      };
      type: 'warn' | 'success' | 'error' | 'info';
    };
  };
}
