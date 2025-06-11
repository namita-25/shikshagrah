// pages/content/[identifier].tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { getContentDetails } from '../../../services/content';
import Grid from '@mui/material/Grid2';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { AtreeCard, ContentSearch, Layout } from '@shared-lib';

const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
  potpourri: '#FFBD0D',
};
interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  posterImage: string;
  contentType: string;
  mimeType: string;
  author: string;
  keywords: string[];
  year: string;
  license: string;
  description: string;
  publisher: string;
  url: string;
  previewUrl: string;
  downloadurl: string;
  image?: string; // Added the 'image' property
  appicon?: string; // Added the 'appicon' property
  access?: string; // Added the 'access' property
}

export default function DetailPage({
  params,
}: {
  params: { identifier: string };
}) {
  const router = useRouter();
  const { identifier } = params; // Access dynamic parameter 'identifier'
  const [contentData, setContentData] = useState<ContentItem | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [relatedContent, setRelatedContent] = useState<any>([]);
  const [filterData, setFilterData] = useState();
  const [subFrameworkFilter, setSubFrameworkFilter] = useState<any[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [subFramework, setSubFramework] = useState('');
  const [framework, setFramework] = useState('');

  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });
  const languageDisplayMap: Record<string, string> = {
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    bengali: 'বাংলা',
    assamese: 'অসমীয়া',
    kannada: 'ಕನ್ನಡ',
    tamil: 'தமிழ்',
    malayalam: 'മലയാളം',
  };
  const handleOpen = () => setOpen(true);
  const handleOnCLick = () => {
    window.open(contentData?.url, '_blank');
  };
  const handlePreview = () => {
    router.push(`/player/${identifier}`);
  };
  const handleOnDownload = async () => {
    if (contentData?.downloadurl) {
      try {
        const response = await fetch(contentData?.downloadurl);
        const blob = await response?.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = contentData?.name ?? ''; // Default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the blob URL after download to free up memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const fetchContent = useCallback(
    async (updatedFilters: any) => {
      setIsLoading(true);
      try {
        const {
          result: { content: result },
        } = await getContentDetails(identifier as string);
        if (result && typeof result === 'object') {
          setContentData(result);
        }
        const cleanKeywords = (
          result?.keywords?.filter((item: any) => item) ?? []
        ).slice(0, 4);
        // .map((keyword: any) => `"${keyword}"`); // Remove #
        const queryString = cleanKeywords;

        let relatedContentTemp: ContentItem[] = [];

        try {
          const searchFilters = {
            ...updatedFilters, // Include existing filters
            keywords: queryString, // Add current content's keywords
          };
          const keywordFilteredResults = await ContentSearch({
            channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
            filters: searchFilters,
          });
          const filtered =
            keywordFilteredResults?.result?.content?.filter(
              (item: any) => item.identifier !== result.identifier
            ) ?? [];

          if (filtered.length > 0) {
            relatedContentTemp = filtered.map((item: any) => ({
              name: item.name ?? '',
              gradeLevel: item.gradeLevel ?? [],
              language: item.language ?? [],
              artifactUrl: item.artifactUrl ?? '',
              identifier: item.identifier ?? '',
              posterImage: item.posterImage ?? '',
              contentType: item.contentType ?? '',
              mimeType: item.mimeType ?? '',
              author: item.author ?? '',
              keywords: item.keywords ?? [],
              year: item.year ?? '',
              license: item.license ?? '',
              description: item.description ?? '',
              publisher: item.publisher ?? '',
              url: item.url ?? '',
              previewUrl: item.previewUrl ?? '',
              downloadurl: item.downloadurl ?? '', // Added missing property
            }));
            // break; // Stop at first successful keyword
          }
        } catch (error) {
          console.error(`Search failed for keyword ${cleanKeywords}:`, error);
          // continue;
        }
        // }

        setRelatedContent(relatedContentTemp);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [identifier]
  );

  const keywords = Array.isArray(contentData?.keywords)
    ? contentData.keywords
    : [];
  const showMoreIcon = keywords && keywords.length > 3;
  const capitalizeFirstLetter = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const displayedKeywords =
    (showMoreIcon ? keywords?.slice(0, 4) : keywords)?.map(
      capitalizeFirstLetter
    ) ?? [];
  const remainingKeywords = keywords.slice(3);
  useEffect(() => {
    if (identifier) {
      fetchContent(filters.request.filters);
    }
  }, [identifier]);

  const fetchFrameworkData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const response = await fetch(url);
      const frameworkData = await response.json();
      let selectedCategory = '';
      if (typeof window !== 'undefined') {
        selectedCategory = localStorage.getItem('category') ?? '';
      }

      const filteredFramework = frameworkData?.result?.framework
        ? {
            ...frameworkData?.result?.framework,
            categories: Array.isArray(
              frameworkData?.result?.framework?.categories
            )
              ? frameworkData.result.framework.categories.filter(
                  (category: any) => category.status === 'Live'
                )
              : [],
          }
        : { categories: [] }; // Provide a default structure if frameworkData is undefined
      setFilterData({
        ...frameworkData?.result?.framework,
        categories: frameworkData?.result?.framework.categories.filter(
          (category: any) => category.status === 'Live'
        ),
      });
      const fdata =
        filteredFramework?.categories?.find(
          (item: any) => item.code === 'topic'
        )?.terms ?? [];
      const selectedFramework = fdata.find(
        (item: any) =>
          item.name?.toLowerCase() === selectedCategory?.toLowerCase()
      );
      const defaultFramework = fdata[0]?.identifier ?? '';
      const frameworkToSet = selectedFramework?.identifier ?? defaultFramework;
      setFramework(frameworkToSet);

      setFrameworkFilter(fdata);
      if (frameworkToSet && fdata) {
        const subFrameworkData = fdata.find(
          (item: any) => item.identifier === frameworkToSet
        );

        if (subFrameworkData?.associations) {
          const uniqueAssociations = Array.from(
            new Map(
              subFrameworkData.associations.map((item: any) => [
                item?.name,
                item,
              ])
            ).values()
          );
          setSubFrameworkFilter(uniqueAssociations);
        }
      }
    } catch (error) {
      console.error('Error fetching framework data:', error);
    }
  };
  useEffect(() => {
    fetchFrameworkData();
  }, []);

  const handleCardClick = (content: any) => {
    router.push(`/contents/${content?.identifier}`);
  };
  const selectTagOnClick = async (keyword: any) => {
    try {
      setIsLoading(true);
      const keywordFilteredResults = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        query: keyword,
      });

      const filteredContent =
        keywordFilteredResults?.result?.content?.filter(
          (item: any) => item.identifier !== identifier
        ) ?? [];

      setRelatedContent(filteredContent);
    } catch (error) {
      console.error(`Search failed for keyword ${keyword}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setFilters(newFilters);
      fetchContent(newFilters.request.filters);
      return newFilters;
    });
  };
  return (
    <>
      {contentData && (
        <Layout
          // showBack
          isFooter={isMobile} // add this when on mobile
          // footerComponent={!isMobile ? <FooterText page="" /> : <Footer />}
          isLoadingChildren={isLoading}
          // backIconClick={() => router.back()}
          // backTitle={contentData?.name || ''}
        >
          {!isMobile ? (
            // Desktop View (Carousel on Right, Content on Left)
            <>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: 2,
                  // marginTop: '60px',
                }}
              >
                {/* Right Side (Content) */}

                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      overflowX: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/home');
                        }}
                        sx={{
                          padding: '4px',
                          // marginTop: '5%',
                          backgroundColor: 'transparent',
                          color: '#000000',
                          borderRadius: '50%',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                          },
                          '&:focus': {
                            outline: 'none',
                          },
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                      {subFrameworkFilter && subFrameworkFilter.length > 0 && (
                        <Title>Browse by Sub Categories</Title>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      padding: '12px 0px',
                      gap: '16px',
                      flexDirection: 'column',
                      display: 'flex',
                    }}
                  >
                    <SubFrameworkFilter
                      subFramework={subFramework}
                      setSubFramework={setSubFramework}
                      lastButton={true}
                      subFrameworkFilter={subFrameworkFilter || []}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      border: '1px solid #C2C7CF',
                      padding: '10px',
                      gap: 2,
                      borderRadius: '10px',
                      // ml: 4,
                    }}
                  >
                    {/* Content Image */}
                    <Grid size={{ xs: 12, md: 3 }}>
                      <ImageCard image={contentData?.appicon ?? ''} name={''} />
                    </Grid>

                    {/* Content Details */}
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Stack spacing={2}>
                        <Typography
                          textAlign="left"
                          sx={{
                            fontFamily: 'Poppins',
                            fontSize: '24px',
                            fontWeight: 400,
                            color: '#000000',
                          }}
                        >
                          {contentData?.name ?? ''}
                        </Typography>
                        {/* Keywords */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '19px',
                            width: '100%',
                          }}
                        >
                          {displayedKeywords.map((label) => (
                            <Chip
                              key={label}
                              label={label}
                              variant="outlined"
                              sx={{
                                height: 32,
                                padding: '4px 6px',
                                borderRadius: '8px',
                                '& .MuiChip-label': {
                                  fontSize: '14px',
                                  fontFamily: 'Poppins',
                                  fontWeight: 500,
                                  color: '#000000',
                                },
                              }}
                              onClick={() =>
                                selectTagOnClick(label.replace('#', ''))
                              }
                            />
                          ))}
                        </Box>

                        {/* Description */}
                        <Typography
                          textAlign="left"
                          sx={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            fontWeight: 400,
                            color: '#000000',
                          }}
                        >
                          {contentData?.description ?? ''}
                        </Typography>

                        {/* Action Buttons */}
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            width: '100%',
                            '& > button': {
                              flex: 1,
                              minWidth: 0,
                              maxWidth: 152,
                              textTransform: 'none',
                              '& .MuiButton-startIcon': {
                                marginRight: '4px',
                              },
                            },
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: '50px',
                              height: '40px',
                              padding: '3px',
                              fontSize: '16px',
                              fontWeight: 500,
                              fontFamily: 'Poppins',
                              color: '#000000',
                              backgroundColor: '#fcd804',
                            }}
                            onClick={handlePreview}
                            disabled={
                              contentData?.access?.trim() === 'Full' ||
                              contentData?.access?.trim() === 'Link'
                            }
                            startIcon={<VisibilityOutlinedIcon />}
                          >
                            Preview
                          </Button>

                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{
                              borderRadius: '50px',
                              height: '40px',
                              color: '#000000',
                              padding: '3px',
                              fontSize: '16px',
                              fontWeight: 500,
                              fontFamily: 'Poppins',
                            }}
                            startIcon={<FileDownloadOutlinedIcon />}
                            disabled={
                              contentData?.access?.trim() === 'Sample' ||
                              contentData?.access?.trim() === 'Link'
                            }
                            onClick={handleOnDownload}
                          >
                            Download
                          </Button>

                          <Button
                            variant="outlined"
                            sx={{
                              borderRadius: '50px',
                              height: '40px',
                              color: '#000000',
                              padding: '3px',
                              fontSize: '16px',
                              fontWeight: 500,
                              fontFamily: 'Poppins',
                              borderColor: '#fcd804',
                            }}
                            startIcon={<LinkOutlinedIcon />}
                            disabled={
                              (contentData?.access?.trim() === 'Sample' ||
                                contentData?.access?.trim() === 'Full') &&
                              !contentData?.url
                            }
                            onClick={handleOnCLick}
                          >
                            Resource Link
                          </Button>
                        </Box>

                        {/* Metadata */}
                        <Stack spacing={0.5}>
                          <Typography
                            textAlign="left"
                            sx={{
                              color: '#000000',
                              fontSize: '16px',
                              fontWeight: 400,
                              fontFamily: 'Poppins',
                            }}
                          >
                            <span
                              style={{
                                color: '#000000',
                                fontSize: '16px',
                                fontWeight: 700,
                                fontFamily: 'Poppins',
                              }}
                            >
                              Author :
                            </span>{' '}
                            {contentData?.author ?? ''}
                          </Typography>
                          <Typography
                            textAlign="left"
                            sx={{
                              color: '#000000',
                              fontSize: '16px',
                              fontWeight: 400,
                              fontFamily: 'Poppins',
                            }}
                          >
                            <span
                              style={{
                                color: '#000000',
                                fontSize: '16px',
                                fontWeight: 700,
                                fontFamily: 'Poppins',
                              }}
                            >
                              Publisher :
                            </span>{' '}
                            {contentData?.publisher ?? ''}
                          </Typography>
                          <Typography
                            textAlign="left"
                            sx={{
                              color: '#000000',
                              fontSize: '16px',
                              fontWeight: 400,
                              fontFamily: 'Poppins',
                            }}
                          >
                            {contentData?.year ?? 'n.d.'}
                          </Typography>
                          <Typography
                            textAlign="left"
                            sx={{
                              color: '#000000',
                              fontSize: '16px',
                              fontWeight: 400,
                              fontFamily: 'Poppins',
                            }}
                          >
                            {(contentData as any)?.language?.[0] && (
                              <Typography
                                textAlign="left"
                                sx={{
                                  display: 'inline-block',
                                  backgroundColor: '#FCD905',
                                  padding: '2px 8px',
                                  color: '#000000',
                                  fontSize: '16px',
                                  fontWeight: 500,
                                  fontFamily: 'Poppins',
                                }}
                              >
                                {languageDisplayMap[
                                  (
                                    contentData as any
                                  ).language[0].toLowerCase?.() ?? ''
                                ] ?? (contentData as any).language[0]}
                              </Typography>
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Related Content Section */}
            </>
          ) : (
            <Box
              sx={{
                padding: 2,
                margin: '0 auto',
                textAlign: 'center',
                borderRadius: 2,
                gap: 2.5,
                display: 'flex',
                flexDirection: 'column',
                pt: '18px',
                marginBottom: '15%',
              }}
            >
              <Box sx={{ px: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/home');
                    }}
                    sx={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      },
                      '&:focus': {
                        outline: 'none',
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  {subFrameworkFilter && subFrameworkFilter.length > 0 && (
                    <Title>Browse by Sub Categories</Title>
                  )}
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    padding: '12px 0px',
                    gap: '16px',
                    flexDirection: 'column',
                    display: 'flex',
                  }}
                >
                  <SubFrameworkFilter
                    subFramework={subFramework}
                    setSubFramework={setSubFramework}
                    lastButton={true}
                    subFrameworkFilter={subFrameworkFilter || []}
                  />
                </Box>
                <ImageCard
                  image={contentData?.appicon ?? ''}
                  name={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {contentData?.name ?? ''}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contentData?.publisher ?? ''}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  width: '100%',
                  textTransform: 'none',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={
                    contentData?.access?.trim() === 'Full' ||
                    contentData?.access?.trim() === 'Link'
                  }
                  sx={{
                    borderRadius: '50px',
                    height: '40px',
                    flex: 0.3,
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    maxWidth: '344px',
                  }}
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={handlePreview}
                >
                  Preview
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                    maxWidth: '300px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 1,
                      color: 'black',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      width: '48%',
                    }}
                    startIcon={<FileDownloadOutlinedIcon />}
                    onClick={handleOnDownload}
                    disabled={
                      contentData?.access?.trim() === 'Sample' ||
                      contentData?.access?.trim() === 'Link'
                    }
                  >
                    Download
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 1,
                      color: 'black',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      width: '48%',
                      whiteSpace: 'nowrap',
                    }}
                    startIcon={<LinkOutlinedIcon />}
                    disabled={
                      (contentData?.access?.trim() === 'Sample' ||
                        contentData?.access?.trim() === 'Full') &&
                      !contentData?.url
                    }
                    onClick={handleOnCLick}
                  >
                    Resource Link
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {displayedKeywords?.map((label: any, index: any) => (
                  <Chip
                    key={index}
                    label={label}
                    variant="outlined"
                    sx={{
                      height: '32px',
                      gap: '2px',
                      padding: '4px 6px',
                      borderRadius: '8px',
                    }}
                    onClick={() => selectTagOnClick(label.replace('#', ''))}
                  />
                ))}
              </Box>

              <Typography
                variant="body1"
                sx={{ mt: 0, textAlign: 'left', fontFamily: 'Arial' }}
              >
                {contentData?.description ?? ''}
              </Typography>

              <Stack spacing={0.5}>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  <b>Author:</b> {contentData?.author || ''}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  <b>Publisher:</b> {contentData?.publisher ?? ''}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  {contentData?.year ?? 'n.d.'}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  {(contentData as any)?.language?.[0] && (
                    <Typography
                      variant="body1"
                      textAlign="left"
                      fontFamily="Arial"
                      sx={{
                        display: 'inline-block',
                        backgroundColor: '#FFBD0D', // highlighted yellow
                        padding: '2px 8px',
                        // borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#000',
                      }}
                    >
                      {languageDisplayMap[
                        (contentData as any).language[0]?.toLowerCase?.() ?? ''
                      ] ?? (contentData as any).language[0]}
                    </Typography>
                  )}
                </Typography>
              </Stack>
            </Box>
          )}
          <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogTitle>More Keywords</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {remainingKeywords.map((label: any) => (
                  <Chip
                    key={label}
                    label={label.charAt(0).toUpperCase() + label.slice(1)}
                    variant="outlined"
                    sx={{
                      height: '32px',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '0px',
                    }}
                    onClick={() => selectTagOnClick(label.replace('#', ''))}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenPopup(false)}
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: '50px',
                  height: '40px',
                  width: '100%',
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Layout>
      )}
    </>
  );
}

const ImageCard = ({
  image,
  name,
  _image,
}: {
  image: string;
  name: React.ReactNode | string;
  _image?: object;
  _text?: object;
}) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={typeof name === 'string' ? name : ''}
          sx={_image}
          image={image}
        />
      </CardActionArea>
    </Card>
  );
};
const Title: React.FC<{
  children: React.ReactNode | string;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 500,
          fontSize: { xs: '16px', md: '24px' },
          lineHeight: '28px',
          color: '#000000',
        }}
      >
        {children}
      </Typography>
      {onClick && (
        <IconButton onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
};
const SubFrameworkFilter = React.memo<{
  subFrameworkFilter: Array<{ identifier: string; name: string }>;
  subFramework: string;
  setSubFramework: (subFramework: string) => void;
  lastButton: boolean;
}>(function SubFrameworkFilter({
  subFrameworkFilter,
  subFramework,
  setSubFramework,
}) {
  const router = useRouter();

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<
    Array<{ identifier: string; name: string }>
  >([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const maxItems = isMobile ? 3 : 5;
  useEffect(() => {
    if (subFrameworkFilter) {
      setFilterItems(subFrameworkFilter.slice(0, maxItems));
    }
  }, [subFrameworkFilter]);
  const handleItemClick = (item: any) => {
    localStorage.setItem('subcategory', item.name);
    router.push(`/contents`);
  };
  const capitalizeFirstLetter = (str: string) => {
    if (str === 'Water based STEM and STEM Activities') {
      return 'Water based STEM and STEAM Activities';
    }
    if (str === 'Grassland') {
      return 'Grasslands';
    }
    // Default case for other strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <Grid container spacing={1}>
      {filterItems?.map((subFrameworkItem: any) => (
        <Grid key={subFrameworkItem.identifier}>
          <Chip
            key={subFrameworkItem.name}
            label={capitalizeFirstLetter(subFrameworkItem.name)}
            variant="outlined"
            sx={{
              height: 32,
              padding: '4px 6px',
              borderRadius: '8px',
              '& .MuiChip-label': {
                fontSize: '14px',
                fontFamily: 'Poppins',
                fontWeight: 500,
                color: '#000000',
              },
            }}
            onClick={() => {
              handleItemClick(subFrameworkItem);
            }}
          />
        </Grid>
      ))}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && (
        <Chip
          label={
            <MoreVertIcon
              fontSize="medium"
              sx={{ width: '11px', height: '11px' }}
            />
          }
          variant="outlined"
          sx={{
            height: 32,
            padding: '4px 6px',
            borderRadius: '8px',
            '& .MuiChip-label': {
              fontSize: '14px',
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
            },
          }}
          onClick={() => {
            setOpenPopup(true);
          }}
        />
      )}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && openPopup && (
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              maxHeight: '80vh',
              overflow: 'hidden',
            },
          }}
        >
          {/* <DialogTitle>Remaining Data</DialogTitle> */}
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenPopup(false);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#484848',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ padding: '45px 30px' }}>
            <FrameworkFilter
              frameworkFilter={subFrameworkFilter}
              framework={subFramework}
              setFramework={setSubFramework}
              fromSubcategory={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </Grid>
  );
});
const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}>(function FrameworkFilter({
  frameworkFilter,
  framework,
  setFramework,
  fromSubcategory,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const transformName = (name: string) => {
    if (name === 'Water based STEM and STEM Activities') {
      return 'Water based STEM and STEAM Activities';
    }
    if (name === 'Grassland') {
      return 'Grasslands';
    }
    return name;
  };
  const handleItemClick = (item: any) => {
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      setFramework(item.identifier);
    }
  };
  return (
    <Grid container spacing={1} display="flex" justifyContent="center">
      {frameworkFilter?.map((frameworkItem: any) => (
        <Grid key={frameworkItem.identifier}>
          <Button
            variant={
              framework === frameworkItem.identifier ? 'contained' : 'outlined'
            }
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
              borderRadius: '8px',
              borderColor:
                framework !== frameworkItem.identifier ? '#CEE5FF' : '',
              backgroundColor:
                framework === frameworkItem.identifier
                  ? frameworkItem?.name?.toLowerCase() in buttonColors
                    ? buttonColors[
                        frameworkItem?.name?.toLowerCase() as keyof typeof buttonColors
                      ]
                    : ''
                  : '',
            }}
            onClick={() => handleItemClick(frameworkItem)}
          >
            {transformName(frameworkItem.name)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
});
