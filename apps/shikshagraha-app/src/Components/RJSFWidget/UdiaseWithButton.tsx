// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { fetchContentOnUdise } from '../../services/LoginService';

const UdiaseWithButton = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  rawErrors = [],
  placeholder,
  onFetchData,
}: WidgetProps & { onFetchData: (data: any) => void }) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Sync local value when prop changes

  const displayErrors = rawErrors.filter(
    (error) => !error.toLowerCase().includes('required')
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setLocalValue(val);
    onChange(val === '' ? undefined : val);
    if (val) {
      setErrorMessage('');
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur(id, value);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus(id, event.target.value);
  };

  const handleClick = async () => {
    if (!localValue) {
      setErrorMessage('Please enter a UDISE Code.');
      return;
    }
    try {
      const response = await fetchContentOnUdise(localValue);

      // if (
      //   !response ||
      //   response?.status === 500 ||
      //   !response?.result ||
      //   response?.result.length === 0
      // ) {
      //   setErrorMessage('No school found. Please enter a valid UDISE Code.');
      //   onFetchData({
      //     udise: '',
      //     school: { _id: '', name: '', externalId: '' },
      //     state: { _id: '', name: '', externalId: '' },
      //     district: { _id: '', name: '', externalId: '' },
      //     block: { _id: '', name: '', externalId: '' },
      //     cluster: { _id: '', name: '', externalId: '' },
      //   });
      //   return;
      // }

      // const locationInfo = response.result[0];
      const locationInfo = {
        _id: '6853e3018500f000144a84a7',
        metaInformation: {
          targetedEntityTypes: [],
          externalId: '29210118001',
          name: 'G LPS BAVIKERE',
        },
        childHierarchyPath: [],
        createdBy: '20',
        updatedBy: '20',
        deleted: false,
        entityTypeId: '6825915c97b5680013e6a148',
        entityType: 'school',
        registryDetails: {
          code: '29210118001',
          locationId: '29210118001',
        },
        tenantId: 'shikshalokam',
        orgId: 'SLOrg',
        updatedAt: '2025-06-19T10:14:28.095Z',
        createdAt: '2025-06-19T10:14:28.095Z',
        __v: 0,
        parentInformation: {
          state: [
            {
              _id: '6853e0168500f000144a3ea4',
              externalId: '29',
              name: 'Karnataka',
            },
          ],
          district: [
            {
              _id: '6853e0828500f000144a3eb0',
              externalId: 'bengaluruRural',
              name: 'Bengaluru Rural',
            },
          ],
          block: [
            {
              _id: '6853e0bb8500f000144a3f12',
              externalId: '292101',
              name: 'Nelamangala',
            },
          ],
          cluster: [
            {
              _id: '6853e0e38500f000144a42f6',
              externalId: '2921010020',
              name: 'KEMPALINGANAHALLI',
            },
          ],
        },
      };

      const sampleResponse = {
        udise: localValue,
        School: {
          // Keep capitalized to match your form's expected structure
          _id: locationInfo?._id || '',
          name: locationInfo?.metaInformation?.name || '',
          externalId: localValue ?? '',
        },
        state: {
          _id: locationInfo?.parentInformation?.state?.[0]?._id || '',
          name: locationInfo?.parentInformation?.state?.[0]?.name || '',
          externalId:
            locationInfo?.parentInformation?.state?.[0]?.externalId ?? '',
        },
        district: {
          _id: locationInfo?.parentInformation?.district?.[0]?._id || '',
          name: locationInfo?.parentInformation?.district?.[0]?.name || '',
          externalId:
            locationInfo?.parentInformation?.district?.[0]?.externalId ?? '',
        },
        block: {
          _id: locationInfo?.parentInformation?.block?.[0]?._id || '',
          name: locationInfo?.parentInformation?.block?.[0]?.name || '',
          externalId:
            locationInfo?.parentInformation?.block?.[0]?.externalId ?? '',
        },
        cluster: {
          _id: locationInfo?.parentInformation?.cluster?.[0]?._id || '',
          name: locationInfo?.parentInformation?.cluster?.[0]?.name || '',
          externalId:
            locationInfo?.parentInformation?.cluster?.[0]?.externalId ?? '',
        },
      };

      onFetchData(sampleResponse);
      setErrorMessage('');
    } catch (e: any) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="flex-start" gap={1}>
        {/* TextField (without helper text pushing layout) */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            id={id}
            label={
              <>
                {label} <span style={{ color: 'red' }}>*</span>
              </>
            }
            value={localValue}
            required={required}
            disabled={disabled || readonly}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            error={displayErrors.length > 0 || !!errorMessage}
            variant="outlined"
            size="small"
            InputProps={{
              sx: {
                '& .MuiInputBase-input': {
                  padding: '10px 12px',
                  fontSize: '12px',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: '12px',
                '&.Mui-focused': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  color: '#582E92',
                },
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  color: '#582E92',
                },
              },
            }}
          />
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          size="small"
          onClick={handleClick}
          disabled={!localValue}
          sx={{
            whiteSpace: 'nowrap',
            bgcolor: '#582E92',
            color: '#FFFFFF',
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '8px 16px',
            '&:hover': {
              bgcolor: '#543E98',
            },
            height: '40px',
            mt: '1px', // slight vertical alignment tweak
          }}
        >
          Fetch
        </Button>
      </Box>
      {/* Show helper/error text below both elements */}

      {(displayErrors.length > 0 || errorMessage) && (
        <Box mt={0.5} ml={0.5}>
          <Typography variant="caption" color="error" sx={{ fontSize: '11px' }}>
            {errorMessage || displayErrors.join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UdiaseWithButton;
