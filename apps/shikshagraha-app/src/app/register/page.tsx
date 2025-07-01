'use client';
import { useEffect, useState, useRef } from 'react';
import { generateRJSFSchema } from '../../utils/generateSchemaFromAPI';
import DynamicForm from '../../Components/DynamicForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  fetchRoleData,
  getSubroles,
  schemaRead,
} from '../../services/LoginService';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formSchema, setFormSchema] = useState<any>();
  const [uiSchema, setUiSchema] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState();
  const [fieldNameToFieldIdMapping, setFieldNameToFieldIdMapping] = useState(
    {}
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [domain, setDomain] = useState<string>('');
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [subRoles, setSubRoles] = useState<any[]>([]);
  const previousRole = useRef<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      const parts = hostname.split('.');

      const skipList = [
        'app',
        'www',
        'dev',
        'staging',
        'tekdinext',
        'org',
        'com',
        'net',
      ];

      // Step 1: Find the most likely base domain part
      const domainPart =
        parts.find((part) => !skipList.includes(part.toLowerCase())) ||
        'default';

      // Step 2: Remove suffixes like -qa, -dev, etc. if present
      const knownSuffixes = ['-qa', '-dev', '-staging'];
      let coreDomain = knownSuffixes.reduce((name, suffix) => {
        return name.endsWith(suffix) ? name.replace(suffix, '') : name;
      }, domainPart);

      // Step 3: Map or format display name
      const displayName = formatDisplayName(coreDomain);
      if (coreDomain === 'shikshagrah') {
        coreDomain = 'shikshagraha';
      }
      setDisplayName(displayName);
      localStorage.setItem('origin', coreDomain);
    }
  }, []);

  const formatDisplayName = (domain: string): string => {
    // Custom rules per domain (if needed)
    if (domain === 'shikshagraha') return 'Shikshagraha';
    if (domain === 'shikshalokam') return 'Shikshalokam';
    if (domain === 'shikshagrah') return 'Shikshagraha';
    // Default: Capitalize first letter
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  };

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const origin = localStorage.getItem('origin') || '';
        const isShikshalokam = origin.includes('shikshalokam');
        console.log('isShikshalokam', isShikshalokam);
        const rolesResponse = await fetchRoleData();
        const rolesData = rolesResponse?.result ?? [];
        setRolesList(rolesData);

        // const response = await schemaRead();
        const response = {
          responseCode: 'OK',
          message: 'Form fetched successfully',
          result: {
            id: 22,
            type: 'user',
            sub_type: 'registration',
            data: {
              template_name: 'defaultTemplate',
              fields: {
                result: [
                  {
                    hint: null,
                    name: 'firstName',
                    type: 'text',
                    label: 'First Name',
                    order: '1',
                    fieldId: null,
                    options: [],
                    pattern: '^(?=.*[a-zA-Z])[a-zA-Z ]+$',
                    coreField: 1,
                    dependsOn: null,
                    maxLength: null,
                    minLength: null,
                    isEditable: true,
                    isPIIField: null,
                    isRequired: true,
                    validation: ['string'],
                    placeholder: 'ENTER_FIRST_NAME',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'lastName',
                    type: 'text',
                    label: 'Last Name',
                    order: '3',
                    fieldId: null,
                    options: [],
                    pattern: '^(?=.*[a-zA-Z])[a-zA-Z ]+$',
                    coreField: 1,
                    dependsOn: null,
                    maxLength: null,
                    minLength: null,
                    isEditable: true,
                    isPIIField: null,
                    isRequired: false,
                    validation: ['string'],
                    placeholder: 'ENTER_LAST_NAME',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'Username',
                    type: 'text',
                    label: 'Username',
                    order: '3',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    maxLength: null,
                    minLength: null,
                    isEditable: true,
                    isPIIField: null,
                    isRequired: true,
                    validation: ['string'],
                    placeholder: 'ENTER_USERNAME',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    order: '4',
                    fieldId: null,
                    options: [],
                    pattern: null,
                    coreField: 1,
                    dependsOn: null,
                    maxLength: null,
                    minLength: null,
                    isEditable: true,
                    isPIIField: null,
                    isRequired: false,
                    validation: ['string'],
                    placeholder: 'ENTER_EMAIL',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'mobile',
                    type: 'text',
                    label: 'Contact Number',
                    order: '5',
                    fieldId: null,
                    options: [],
                    pattern: '^[0-9]{10}$',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: false,
                    validation: ['mobile'],
                    placeholder: 'ENTER_CONTACT_NUMBER',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'password',
                    type: 'text',
                    label: 'Password',
                    order: '6',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: ['password'],
                    placeholder: 'ENTER_PASSWORD',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'confirm_password',
                    type: 'text',
                    label: 'Confirm Password',
                    order: '6',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: ['password'],
                    placeholder: 'ENTER_CONFIRM_PASSWORD',
                    isMultiSelect: false,
                    maxSelections: 0,
                    sourceDetails: {},
                  },
                  {
                    hint: null,
                    name: 'Role',
                    type: 'drop_down',
                    label: 'Role',
                    order: '7',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: true,
                      maxSelections: 1,
                    },
                  },
                  {
                    hint: null,
                    name: 'Sub-Role',
                    type: 'drop_down',
                    label: 'Sub-Role',
                    order: '8',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: false,
                      isMultiSelect: true,
                      maxSelections: 10,
                    },
                  },
                  {
                    hint: null,
                    name: 'Registration Code',
                    type: 'text',
                    label: 'Registration Code',
                    order: '9',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'Udise',
                    type: 'text',
                    label: 'Udise',
                    order: '10',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'State',
                    type: 'text',
                    label: 'State',
                    order: '11',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'District',
                    type: 'text',
                    label: 'District',
                    order: '12',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'Block',
                    type: 'text',
                    label: 'Block',
                    order: '13',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'Cluster',
                    type: 'text',
                    label: 'Cluster',
                    order: '14',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                  {
                    hint: null,
                    name: 'School',
                    type: 'text',
                    label: 'School',
                    order: '15',
                    fieldId: null,
                    options: [],
                    pattern: '',
                    coreField: 1,
                    dependsOn: null,
                    isEditable: true,
                    isPIIField: true,
                    isRequired: true,
                    validation: {
                      isEditable: true,
                      isRequired: true,
                      isMultiSelect: false,
                    },
                  },
                ],
                context: 'USERS',
                contextType: 'LEARNER',
              },
            },
            version: 2,
            organization_id: 10,
            tenant_code: 'shikshalokam',
            created_at: '2025-05-14T07:45:04.501Z',
            updated_at: '2025-06-30T10:44:40.954Z',
            deleted_at: null,
          },
          meta: {
            formsVersion: [
              {
                id: 2,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 3,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 4,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 5,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 1,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 6,
                type: 'homelist',
                version: 0,
              },
              {
                id: 7,
                type: 'projectHome',
                version: 0,
              },
              {
                id: 8,
                type: 'surveyHome',
                version: 0,
              },
              {
                id: 9,
                type: 'form',
                version: 0,
              },
              {
                id: 10,
                type: 'KR001',
                version: 0,
              },
              {
                id: 11,
                type: 'homelist',
                version: 0,
              },
              {
                id: 12,
                type: 'projectHome',
                version: 0,
              },
              {
                id: 13,
                type: 'surveyHome',
                version: 0,
              },
              {
                id: 14,
                type: 'form',
                version: 0,
              },
              {
                id: 15,
                type: 'KR001',
                version: 0,
              },
              {
                id: 16,
                type: 'homelist',
                version: 0,
              },
              {
                id: 17,
                type: 'projectHome',
                version: 0,
              },
              {
                id: 18,
                type: 'surveyHome',
                version: 0,
              },
              {
                id: 19,
                type: 'form',
                version: 0,
              },
              {
                id: 20,
                type: 'KR001',
                version: 0,
              },
              {
                id: 21,
                type: 'testA',
                version: 0,
              },
              {
                id: 24,
                type: 'user',
                version: 12,
              },
              {
                id: 25,
                type: 'solutionList',
                version: 7,
              },
              {
                id: 23,
                type: 'solutionList',
                version: 1,
              },
              {
                id: 26,
                type: 'projectHome',
                version: 0,
              },
              {
                id: 28,
                type: 'KR001',
                version: 0,
              },
              {
                id: 27,
                type: 'profileTest',
                version: 0,
              },
              {
                id: 29,
                type: 'testA',
                version: 0,
              },
              {
                id: 30,
                type: 'homelist',
                version: 0,
              },
              {
                id: 32,
                type: 'surveyHome',
                version: 0,
              },
              {
                id: 31,
                type: 'form',
                version: 0,
              },
              {
                id: 22,
                type: 'user',
                version: 2,
              },
            ],
            correlation: '8eedae5d-7815-4717-8e5f-8aae52bda326',
          },
        };
        const fields = response?.result?.data?.fields?.result ?? [];
        const meta = response?.result?.data?.fields?.meta ?? {};
        console.log('meta', meta);
        if (fields.length === 0) {
          throw new Error('No form fields received from API');
        }

        let subrolesData = [];
        const selectedRoleObj = rolesData.find((role: any) => role.externalId);
        if (selectedRoleObj) {
          const subrolesResponse = await getSubroles(selectedRoleObj._id);
          subrolesData = subrolesResponse.result ?? [];
          setSubRoles(subrolesData);
        }

        const { schema, uiSchema, fieldNameToFieldIdMapping } =
          generateRJSFSchema(fields, selectedRoleObj, rolesData, subrolesData);

        console.log('schema', schema);
        const registrationCodeConfig = meta.registration_code;

        setFormSchema({
          ...schema,
          meta: {
            ...schema.meta,
            isShikshalokam,
            registrationCodeConfig,
          },
        });
        // setFormSchema(schema);
        setUiSchema(uiSchema);
        setFieldNameToFieldIdMapping(fieldNameToFieldIdMapping);
      } catch (error) {
        console.error('Error fetching schema:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
    setIsAuthenticated(!!localStorage.getItem('accToken'));
  }, []);

  const handleSubmit = ({ formData }: any) => {
    setFormData(formData);
  };

  const handleBack = () => {
    router.push('/');
  };

  useEffect(() => {
    if (formSchema && uiSchema) {
      console.log('Final Role field schema:', {
        schema: formSchema.properties?.Role,
        uiSchema: uiSchema?.Role,
        rolesList,
      });
    }
  }, [formSchema, uiSchema]);

  const StaticHeader = () => (
    <Box
      sx={{
        p: 2,
        borderBottom: '2px solid #FFD580',
        boxShadow: '0px 2px 4px rgba(255, 153, 17, 0.2)',
        backgroundColor: '#FFF7E6',
        borderRadius: '0 0 25px 25px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={3} sm={2}>
          <Button
            onClick={handleBack}
            sx={{
              color: '#572E91',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F5F5F5',
              },
            }}
          >
            <ArrowBackIcon sx={{ marginRight: '4px' }} />
            Back
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          sm={8}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#572E91',
              fontWeight: 'bold',
              fontSize: {
                xs: '1rem',
                sm: '1.25rem',
              },
            }}
          >
            {displayName}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: '16px',
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f5f5f5',
            paddingBottom: '60px',
          }}
        >
          <StaticHeader />
          <Box
            sx={{
              ml: 'auto',
              mr: 'auto',
              width: {
                xs: '90vw',
                md: '50vw',
              },
              display: 'flex',
              flexDirection: 'column',
              // bgcolor: '#fff',
              p: {
                xs: '20px',
                md: '40px',
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#572E91',
                fontWeight: 'bold',
                mb: 2,
                textAlign: 'center',
                fontSize: {
                  xs: '1.2rem',
                  sm: '1.5rem',
                },
              }}
            >
              Welcome to {displayName}
            </Typography>

            {formSchema && (
              <DynamicForm
                schema={formSchema}
                uiSchema={uiSchema}
                SubmitaFunction={handleSubmit}
                hideSubmit={false}
                onChange={({ formData }) => {
                  if (formData.Role) {
                    setFormData((prev) => ({ ...prev, 'Sub-Role': [] }));
                  }
                }}
                fieldIdMapping={fieldNameToFieldIdMapping}
              />
            )}
          </Box>
        </Box>
      </ThemeProvider>
    );
  } else {
    const redirectUrl = '/';
    router.push(redirectUrl);
  }
}
