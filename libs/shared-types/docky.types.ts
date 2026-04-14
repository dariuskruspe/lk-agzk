export interface DockyFeature {
  id: string;
  name: string;
  phrases: string[];

  message?: string;
  type: DockyFeatureType;
  link?: string;
  issueSearchRules?: any;
}

export type DockyFeatureType = 'issue' | 'link';

export type DockyTuneExportType = {
  items: DockyFeature[];
};
