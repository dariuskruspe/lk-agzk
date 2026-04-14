export interface FeedbackInterface {
  feedbackID: string;
  date: string;
  recipientID: string;
  recipientName: string;
  senderID: string;
  senderName: string;
  type: string;
  stateID: string;
  stateName: string;
  count: number;
  isAnonymous: boolean;
  sendingAvailable: boolean;
  questionnaireID: string;
  questions: {
    questionID: string;
    formulation: string;
    required: boolean;
    answer?: string;
  }[];
}
