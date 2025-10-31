const UserStrucure = {
    FullName: "",
    Age: 0,
    Email: "",
    Address: {
        Street: "",
        City: "",
        ZipCode: ""
    },
    PhoneNumber: "",
    EmergencyContact: {
        Name: "",
        Relationship: "",
        PhoneNumber: ""
    },
    AppliedPrograms: [],
    WisitedPrograms: [],
}


const NgoStructure = {
    OrganizationName: "",
    RegistrationNumber: "",
    Address: {
        Street: "",
        City: "",
        ZipCode: ""
    },
    ContactPerson: {
        Name: "",
        Position: "",
        PhoneNumber: "",
        Email: ""
    },
    ServicesOffered: [],
    BeneficiaryCount: 0,
    ActiveProjects: [],
}

const Schemes = {
    SchemeName: "",
    Description: "",
    EligibilityCriteria: "",
    ApplicationProcess: "",
    Benefits: "",
    ContactInfo: {
        PhoneNumber: "",
        Email: ""
    },
    ApplicationDeadline: "",
    currentApplication: "",
}

export {UserStrucure, NgoStructure, Schemes};

