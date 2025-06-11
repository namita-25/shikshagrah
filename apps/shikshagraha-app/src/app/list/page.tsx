'use client';
import React, { useEffect, useState } from 'react';
import {
  ContentSearchResponse,
  RESOURCE_TYPES,
  MIME_TYPES,
  Layout,
  AtreeCard,
  ContentSearch,
} from '@shared-lib';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Grid2';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
import dynamic from 'next/dynamic';
interface ListProps {}
const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const getLocalStorageItem = (key: string) => {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
};

export default function List() {
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);
  const router = useRouter();
  const [contentData, setContentData] = useState<any>([]);
  const subCategory = getLocalStorageItem('subcategory');
  const storedCategory = getLocalStorageItem('category');

  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });
  const fetchContentData = async (updatedFilters: any) => {
    try {
      setIsLoadingChildren(true);

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: updatedFilters,
      });

      setContentData(data?.result?.content ?? []);
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };
  useEffect(() => {
    fetchContentData(filters.request.filters);
  }, []);
  useEffect(() => {
    const init = async () => {
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);
  useEffect(() => {}, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFrameworkData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const response = await fetch(url);
        const frameworkData = await response.json();
        setFrameworkFilter(frameworkData?.result?.framework);
      } catch (error) {
        console.error('Error fetching framework data:', error);
      }
    };
    fetchFrameworkData();
  }, []);

  const handleApplyFilters = async (selectedValues: any) => {
    const { offset, limit, ...filters } = selectedValues;
    setFilters((prevFilters: any) => {
      // Create a new filters object, preserving previous filters
      let cleanedFilters = {
        ...prevFilters.request.filters,
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([key, value]) => Array.isArray(value) && value.length > 0
          )
        ),
      };

      // Ensure topic is set correctly

      // Explicitly remove mimeType if it's empty OR if it's inherited from prevFilters
      if (!filters.mimeType || filters.mimeType.length === 0) {
        delete cleanedFilters.mimeType;
      }
      if (!filters.resource || filters.resource.length === 0) {
        delete cleanedFilters.resource;
      }

      const newFilters = {
        request: {
          filters: cleanedFilters,
          offset: offset ?? prevFilters.request.offset ?? 0,
          limit: limit ?? prevFilters.request.limit ?? 5,
        },
      };

      fetchContentData(newFilters.request.filters);
      return newFilters;
    });
  };

  const boxStyles = {
    padding: 0,
    minHeight: '100vh',
    width: '100%',
    overflow: { md: 'hidden', xs: 'auto' },
    display: 'flex',
    flexDirection: 'column',
  };
  const handleCardClick = (content: any) => {
    localStorage.removeItem('selectedFilters');
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    router.push(`/detail/${content?.identifier}`);
  };
  return (
    <Layout
      showTopAppBar={{
        title: 'Contents',
        showMenuIcon: true,
        showBackIcon: true,
      }}
      isFooter={true}
      showLogo={true}
      showBack={true}
    >
      <Box sx={{ marginTop: '5%', marginBottom: '5%' }}>
        {!isMobile ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box sx={boxStyles}>
                <AtreeCard
                  contents={contentData}
                  handleCardClick={handleCardClick}
                  _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
                  // _card={{ image: atreeLogo.src }}
                />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box sx={boxStyles}>{/* <Content {...contentProps} /> */}</Box>
        )}
      </Box>
    </Layout>
  );
}
