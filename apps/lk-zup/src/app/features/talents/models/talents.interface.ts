export interface TalentsListInterface {
  employeeID: string;
  subordinates: SubordinateTalentInterface[];
  count: number;
}

export interface SubordinateTalentInterface {
  employeeID: string;
  fullName: string;
  position: string;
  division: string;
  talent: string;
  photo: string;
  image64: string;
  imageExt: string;
  userID: string;
  color?: string;
  state?: string;
}

export interface TalentItemInterface {
  employeeID: string;
  talents: {
    talentID: string;
    name: string;
    color: string;
  }[];
  changeHistory: {
    talentID: string;
    name: string;
    description: string;
    isDelete: false;
    modificationDate: string;
    color?: string;
  }[];
}

export interface TalentGridInterface {
  talents:
    {
      talentID: string,
      talent: string,
      priority: number,
      type: string,
      color: string
    }[],
  employees:
    {
      employeeID: string,
      userID: string,
      fullName: string,
      points: {
        potential: number,
        efficiency: number
      },
      image64: string,
      imageExt: string
    }[]
}
