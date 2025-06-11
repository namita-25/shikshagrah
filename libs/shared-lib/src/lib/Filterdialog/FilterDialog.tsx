// sonar-exclusion
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';
import ResetImage from '../../assets/images/Component 1.svg';
import Image from 'next/image';
const formControlStyles = {
  '&.Mui-focused': { color: '#1D1B20' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1D1B20' },
  '& .MuiInputLabel-root': { color: '#1D1B20' },
  '& .MuiOutlinedInput-root': {
    color: '#1D1B20',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1D1B20' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1D1B20' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1D1B20',
    },
  },
};

// Reusable Checkbox Component
const CustomCheckbox = ({
  option,
  filterCode,
  handleCheckboxChange,
  currentSelectedValues,
}: any) => (
  <FormControlLabel
    key={option.label}
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontSize: '14px', // Corrected spelling
      },
    }}
    control={
      <Checkbox
        size="small"
        checked={currentSelectedValues.includes(option.label)}
        onChange={(event) => handleCheckboxChange(event, filterCode)}
        value={option.label}
        sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }}
      />
    }
    label={option.label}
  />
);
const CustomResourceCheckbox = ({
  option,
  filterCode,
  handleCheckboxChange,
  currentSelectedValues,
}: any) => (
  <FormControlLabel
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontFamily: 'poppins', // Corrected spelling
        fontSize: '16px',
        fontWeight: 400,
        color: '#000000',
      },
    }}
    key={option.label}
    control={
      <Checkbox
        size="small"
        checked={
          Array.isArray(currentSelectedValues) &&
          currentSelectedValues.includes(
            filterCode === 'mimeType' ? option.value : option.label
          )
        }
        onChange={(event) => handleCheckboxChange(event, filterCode)}
        value={filterCode === 'mimeType' ? option.value : option.label}
        sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }}
      />
    }
    label={option.label}
  />
);

// Reusable Radio Component
const CustomRadio = ({ option }: any) => (
  <FormControlLabel
    value={option.value}
    sx={{
      p: '0px',
      margin: '-5px', // Remove default margin
      '& .MuiFormControlLabel-label': {
        // Target the label specifically
        fontSize: '14px', // Corrected spelling
      },
    }}
    control={
      <Radio
        size="small"
        sx={{ color: '#1D1B20', '&.Mui-checked': { color: '#FFBD0D' } }}
      />
    }
    label={option.label}
  />
);
export const FilterDialog = ({
  open,
  onClose,
  filter,
  selectedSubjects,
  selectedContentTypes,
  onSubjectsChange,
  onContentTypeChange,
  onApply,
  frameworkFilter,
  filterValues,
  isMobile = false,
  resources = [],
  mimeType = [],
}: {
  open?: boolean;
  onClose?: () => void;
  filter?: {
    sort?: boolean;
    language?: string[];
    subject?: string[];
    contentType?: string[];
  };
  language?: string;
  selectedSubjects?: string[];
  selectedContentTypes?: string[];
  sort?: any;
  onLanguageChange?: (language: string) => void;
  onSubjectsChange?: (subjects: string) => void;
  onContentTypeChange?: (contentType: string) => void;
  onSortChange?: (sort: any) => void;
  onApply?: (data: any) => void;
  frameworkFilter: any;
  filterValues: any;
  isMobile?: boolean;
  resources?: { label: string; value: string }[];
  mimeType?: { label: string; value: string }[];
}) => {
  // Manage the selected values for each category
  const [selectedValues, setSelectedValues] = useState(filterValues ?? {});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    resource: [] as string[],
    mimeType: [] as string[],
  });

  useEffect(() => {
    const mimeType = filterValues?.request?.filters?.mimeType;
    const resource = filterValues?.request?.filters?.resource;

    const isMimeTypeEmpty = !mimeType || mimeType.length === 0;
    const isResourceEmpty = !resource || resource.length === 0;

    if (isMimeTypeEmpty && isResourceEmpty) {
      setSelectedValues({});
      setSelectedFilters({
        mimeType: [],
        resource: [],
      });
    } else {
      setSelectedValues({
        mimeType: mimeType || [],
        resource: resource || [],
      });

      setSelectedFilters({
        mimeType: mimeType || [],
        resource: resource || [],
      });
    }
    if (filterValues?.request?.filters?.topic) {
      setSelectedTopic(filterValues?.request?.filters?.topic);
      setSelectedValues({
        topic: filterValues?.request?.filters?.topic,
        subTopic: filterValues?.request?.filters?.subTopic,
      });
    }
    if (filterValues?.filters?.topic) {
      localStorage.setItem('category', filterValues?.filters?.topic);

      setSelectedTopic(filterValues?.filters?.topic);
      setSelectedValues({
        topic: filterValues?.filters?.topic,
        subTopic: filterValues?.filters?.subTopic,
      });
    }
  }, [filterValues]);

  useEffect(() => {
    const savedFilters = localStorage.getItem('selectedFilters');
    if (savedFilters) {
      setSelectedFilters(JSON.parse(savedFilters));
      setSelectedValues(JSON.parse(savedFilters));
    }
  }, []);
  const updateSelectedValues = (filterCode: string, newValue: any) => {
    setSelectedValues((prev: any) => ({
      ...prev,
      [filterCode]: newValue,
      ...(filterCode === 'topic' && { subTopic: [] }), // Reset subTopic if topic changes
    }));
  };
  const handleChange = (event: any, filterCode: string) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    localStorage.setItem('category', newValue[0]);
    if (filterCode === 'topic') {
      setSelectedTopic(newValue); // Update the selected topic state
    }

    updateSelectedValues(filterCode, newValue);
  };

  const handleCheckboxChange = (event: any, filterCode: string) => {
    const { checked, value } = event.target;

    setSelectedValues((prev: any) => {
      const currentValues = prev[filterCode] || [];
      const subCategory = checked
        ? [...currentValues, value]
        : currentValues.filter((v: string) => v !== value);
      localStorage.setItem('subcategory', subCategory);
      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split('/')[0];

      const telemetryInteract = {
        context: {
          env: env,
          cdata: [],
        },
        edata: {
          id: 'center-created-successfully',
          type: TelemetryEventType.CLICK,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
      telemetryFactory.interact(telemetryInteract);
      return {
        ...prev,
        [filterCode]: checked
          ? [...currentValues, value]
          : currentValues.filter((v: string) => v !== value),
      };
    });
  };

  const handleResourceCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterType: 'resource' | 'mimeType'
  ) => {
    const { checked, value } = event.target;
    const currentValues = selectedFilters[filterType] || [];

    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);

    const updatedFilters = {
      ...selectedFilters,
      [filterType]: updatedValues,
    };

    setSelectedFilters(updatedFilters);
    setSelectedValues((prev: any) => ({
      ...prev,
      [filterType]: updatedValues,
    }));

    localStorage.setItem('selectedFilters', JSON.stringify(updatedFilters));
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `${updatedFilters?.resource}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    onApply?.(updatedFilters);
  };

  useEffect(() => {
    console.log(
      'Updated Filters (inside useEffect)==',
      selectedValues,
      selectedFilters
    );
  }, [selectedValues, selectedFilters]);
  const handleCloseDialog = () => {
    onApply?.({});
    setSelectedValues({});

    localStorage.removeItem('selectedFilters');
    onClose?.();
  };

  const CommonFilterContent = ({
    resources,
    selectedFilters,
    handleResourceCheckboxChange,
    onApply,
    setSelectedValues,
    mimeType,
    filter,
    selectedSubjects,
    onSubjectsChange,
    selectedContentTypes,
    onContentTypeChange,
  }: any) => {
    return (
      <Box
        sx={{
          padding: '8px 18px',
          borderRadius: '16px',
          marginTop: '13.5px',
          border: '1px solid #DDDDDD',
          boxShadow: '0px 20px 24px -1px #0A0D121A',
        }}
      >
        <Box sx={{ flexDirection: 'column' }}>
          <FormControl fullWidth sx={formControlStyles}>
            {resources?.length > 0 && (
              <Box sx={{ display: 'grid' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '-7px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontWeight: 500,
                      color: '#181D27',
                      margin: '3px 0px',
                      fontFamily: 'Poppins',
                    }}
                  >
                    Resource Type
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedValues({});
                      selectedFilters.mimeType = [];
                      selectedFilters.resource = [];
                      localStorage.removeItem('selectedFilters');
                      onApply?.({});
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Image
                        src={ResetImage}
                        alt="Reset"
                        width={47}
                        height={45}
                        style={{ marginRight: 4 }}
                      />
                    </Box>
                  </Button>
                </Box>
                {resources?.map((option: any) => (
                  <CustomResourceCheckbox
                    key={option?.label}
                    option={option}
                    filterCode="resource"
                    handleCheckboxChange={handleResourceCheckboxChange}
                    currentSelectedValues={selectedFilters.resource}
                  />
                ))}
              </Box>
            )}
          </FormControl>
        </Box>

        {/* Subject Filter */}
        {filter?.subject?.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              multiple
              value={selectedSubjects || []}
              onChange={(e) => {
                const value = e.target.value as string[];
                onSubjectsChange?.(value);
              }}
              renderValue={(selected) => (selected as string[]).join(', ')}
              label="Subject"
            >
              {filter.subject.map((subject: any) => (
                <MenuItem key={subject} value={subject}>
                  <Checkbox
                    checked={(selectedSubjects || []).includes(subject)}
                  />
                  <ListItemText primary={subject} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Content Type Filter */}
        {filter?.contentType?.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type</InputLabel>
            <Select
              multiple
              value={selectedContentTypes || []}
              onChange={(e) => {
                const value = e.target.value as string[];
                onContentTypeChange?.(value);
              }}
              renderValue={(selected) => (selected as string[]).join(', ')}
              label="Content Type"
            >
              {filter.contentType.map((type: any) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    checked={(selectedContentTypes || []).includes(type)}
                  />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    );
  };

  return (
    <>
      {isMobile ? (
        <Dialog
          open={open ?? false}
          onClose={onClose}
          // maxWidth="sm"
          sx={{
            borderRadius: '16px',
            '& .MuiDialog-paper': {
              backgroundColor: '#FEF7FF',
              display: 'flex',
              flexDirection: 'column',
              height: '90vh',
              // maxHeight: '600px',
              width: { xs: '100%', sm: '100%', md: '30%' },
              // maxWidth: '340px',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '0px 16px',
            }}
          >
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              flex: 1,
              overflow: 'hidden',
              padding: '0px 16px',
            }}
          >
            <CommonFilterContent
              resources={resources}
              selectedFilters={selectedFilters}
              handleResourceCheckboxChange={handleResourceCheckboxChange}
              onApply={onApply}
              setSelectedValues={setSelectedValues}
              mimeType={mimeType}
              filter={filter}
              selectedSubjects={selectedSubjects}
              onSubjectsChange={onSubjectsChange}
              selectedContentTypes={selectedContentTypes}
              onContentTypeChange={onContentTypeChange}
            />
            {/* Buttons */}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  onApply?.(selectedValues);
                  onClose?.();
                }}
                sx={{
                  borderRadius: '100px',
                  bgcolor: '#FFBD0D',
                  color: '#2B3133',
                  marginLeft: 2,
                  textTransform: 'none',
                  width: '132px',
                }}
              >
                Apply
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      ) : (
        <Box
          sx={{
            padding: '8px 18px',
            borderRadius: '16px',
            marginTop: '13.5px',
            border: '1px solid #DDDDDD',
            boxShadow: '0px 20px 24px -1px #0A0D121A',
          }}
        >
          <Box sx={{ flexDirection: 'column' }}>
            {/* new filter frameworkFilter */}
            <FormControl fullWidth sx={formControlStyles}>
              {resources?.length > 0 && (
                <Box sx={{ display: 'grid' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      // margin: '3px 0px',
                      marginTop: '-7px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '24px',
                        fontWeight: 500,
                        color: '#181D27',
                        margin: '3px 0px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      Resource Type
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedValues({});
                        selectedFilters.mimeType = [];
                        selectedFilters.resource = [];
                        localStorage.removeItem('selectedFilters');
                        onApply?.({});
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Image
                          src={ResetImage}
                          alt="Reset"
                          width={47}
                          height={45}
                          style={{ marginRight: 4 }}
                        />
                      </Box>
                    </Button>
                  </Box>
                  {resources?.map((option: any) => (
                    <CustomResourceCheckbox
                      key={option?.label}
                      option={option}
                      filterCode="resource"
                      handleCheckboxChange={handleResourceCheckboxChange}
                      currentSelectedValues={selectedFilters.resource}
                    />
                  ))}
                </Box>
              )}
              {/* SubTopic - Checkboxes */}

              {/* <Box sx={{ display: 'grid' }}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#181D27',
                    margin: '3px',
                  }}
                >
                  Content Type
                </Typography>
                {mimeType?.map((option: any) => (
                  <CustomResourceCheckbox
                    key={option?.label}
                    option={option}
                    filterCode="mimeType"
                    handleCheckboxChange={handleResourceCheckboxChange}
                    currentSelectedValues={selectedFilters.mimeType ?? []}
                  />
                ))}
              </Box> */}
            </FormControl>
          </Box>

          {/* Subject */}
          {filter?.subject && filter.subject.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                multiple
                value={selectedSubjects || []}
                onChange={(e) => {
                  const value = e.target.value as string[]; // Ensure TypeScript recognizes it as an array
                  //@ts-ignore
                  onSubjectsChange?.(value);
                }}
                renderValue={(selected) => (selected as string[]).join(', ')} // Join array values for display
                label="Subject"
              >
                {filter.subject.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    <Checkbox
                      checked={(selectedSubjects || []).indexOf(subject) > -1}
                    />
                    <ListItemText primary={subject} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Content Type */}
          {filter?.contentType && filter.contentType.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Content Type</InputLabel>
              <Select
                multiple
                value={selectedContentTypes || []}
                onChange={(e) => {
                  const value = e.target.value as string[];
                  //@ts-ignore
                  onContentTypeChange?.(value);
                }}
                renderValue={(selected) => (selected as string[]).join(', ')}
                label="Content Type"
              >
                {filter.contentType.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox
                      checked={(selectedContentTypes || []).indexOf(type) > -1}
                    />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      )}
    </>
  );
};

export default React.memo(FilterDialog);
