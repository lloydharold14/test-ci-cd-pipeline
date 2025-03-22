export interface Company {
    companyId: string;
    name: string;
    doctorIds?: string[]; // List of doctors associated with the company
  }