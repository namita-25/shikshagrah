import axios, { AxiosRequestConfig } from 'axios';

interface ContentProps {
  result: {
    content: ContentSearchResponse[];
  };
}
export interface ContentSearchResponse {
  ownershipType?: string[];
  publish_type?: string;
  copyright?: string;
  se_gradeLevelIds?: string[];
  keywords?: string[];
  subject?: string[];
  targetMediumIds?: string[];
  channel?: string;
  downloadUrl?: string;
  organisation?: string[];
  language?: string[];
  mimeType?: string;
  variants?: {
    spine?: {
      ecarUrl?: string;
      size?: string;
    };
    online?: {
      ecarUrl?: string;
      size?: string;
    };
  };
  leafNodes?: string[];
  targetGradeLevelIds?: string[];
  objectType?: string;
  se_mediums?: string[];
  appIcon?: string;
  primaryCategory?: string;
  contentEncoding?: string;
  lockKey?: string;
  generateDIALCodes?: string;
  totalCompressedSize?: number;
  mimeTypesCount?: Record<string, number>;
  contentType?: string;
  se_gradeLevels?: string[];
  trackable?: {
    enabled?: string;
    autoBatch?: string;
  };
  identifier?: string;
  audience?: string[];
  se_boardIds?: string[];
  subjectIds?: string[];
  toc_url?: string;
  visibility?: string;
  contentTypesCount?: Record<string, number>;
  author?: string;
  consumerId?: string;
  childNodes?: string[];
  discussionForum?: {
    enabled?: string;
  };
  mediaType?: string;
  osId?: string;
  graph_id?: string;
  nodeType?: string;
  lastPublishedBy?: string;
  version?: number;
  se_subjects?: string[];
  license?: string;
  size?: number;
  lastPublishedOn?: string;
  name?: string;
  attributions?: string[];
  targetBoardIds?: string[];
  status?: string;
  code?: string;
  publishError?: string | null;
  credentials?: {
    enabled?: string;
  };
  prevStatus?: string;
  description?: string;
  posterImage?: string;
  idealScreenSize?: string;
  createdOn?: string;
  se_boards?: string[];
  targetSubjectIds?: string[];
  se_mediumIds?: string[];
  copyrightYear?: number;
  contentDisposition?: string;
  additionalCategories?: string[];
  lastUpdatedOn?: string;
  dialcodeRequired?: string;
  createdFor?: string[];
  creator?: string;
  os?: string[];
  se_subjectIds?: string[];
  se_FWIds?: string[];
  targetFWIds?: string[];
  pkgVersion?: number;
  versionKey?: string;
  migrationVersion?: number;
  idealScreenDensity?: string;
  framework?: string;
  depth?: number;
  s3Key?: string;
  lastSubmittedOn?: string;
  createdBy?: string;
  compatibilityLevel?: number;
  leafNodesCount?: number;
  userConsent?: string;
  resourceType?: string;
  node_id?: number;
  topic?: string | string[];
  subTopic?: string | string[];
  reader?: string;
  image?: string;
}
// Define the payload
const data = {
  request: {
    filters: {
      primaryCategory: [
        'Collection',
        'Resource',
        'Content Playlist',
        'Course',
        'Course Assessment',
        'Digital Textbook',
        'eTextbook',
        'Explanation Content',
        'Learning Resource',
        'Lesson Plan Unit',
        'Practice Question Set',
        'Teacher Resource',
        'Textbook Unit',
        'LessonPlan',
        'FocusSpot',
        'Learning Outcome Definition',
        'Curiosity Questions',
        'MarkingSchemeRubric',
        'ExplanationResource',
        'ExperientialResource',
        'Practice Resource',
        'TVLesson',
        'Course Unit',
        'Exam Question',
        'Question paper',
      ],
    },
  },
};

export const ContentSearch = async ({
  type,
  query,
  filters,
  limit,
  offset = 0,
  channel,
}: {
  type?: string;
  channel: string;
  query?: string;
  filters?: object;
  limit?: number;
  offset?: number;
}): Promise<ContentProps> => {
  try {
    // Ensure the environment variable is defined
    const searchApiUrl = process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL;
    const hierarchyPath = process.env.NEXT_PUBLIC_SSUNBIRD_HIERARCHY_PATH;
    if (!searchApiUrl || !hierarchyPath) {
      throw new Error(
        !searchApiUrl
          ? 'Search API URL environment variable is not configured'
          : !hierarchyPath
          ? 'Hierarchy path environment variable is not configured'
          : ''
      );
    }
    // Axios request configuration

    const data = {
      request: {
        filters: {
          channel,
          contentType: {
            ne: 'Asset',
          },
          ...filters,
        },

        query,
        limit,
        offset,
      },
    };
    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${searchApiUrl}${process.env.NEXT_PUBLIC_SSUNBIRD_HIERARCHY_PATH}/search`,
      data: data,
    };

    // Execute the request
    const response = await axios.request(config);
    const res = response?.data;

    return res;
  } catch (error) {
    console.error('Error in ContentSearch:', error);
    throw error;
  }
};
