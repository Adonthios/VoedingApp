export class QuizResult {
  $key: string;
  uid: string;
  email: string;
  quizid: number;
  correctFirstTime: number;

  constructor(data: any) {
      data = data || {};
      this.$key = data.$key;
      this.uid = data.uid;
      this.email = data.email;
      this.quizid = data.quizid;
      this.correctFirstTime = data.correctFirstTime;
  }
}
