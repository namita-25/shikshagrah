import { generateUUID, getDeviceId } from './Helper';
const hostURL = process.env.NEXT_PUBLIC_TELEMETRY_URL;
let CsTelemetryModule: typeof import('@project-sunbird/client-services/telemetry').CsTelemetryModule | undefined;
let EkTelemetry;
declare global {
  interface Window {
    jQuery: any;
  }
}
let jQuery;

if (typeof window !== 'undefined') {
  CsTelemetryModule =
    require('@project-sunbird/client-services/telemetry').CsTelemetryModule;
  EkTelemetry = require('@project-sunbird/telemetry-sdk');
  jQuery = require('jquery');
  window.jQuery = jQuery;
}

const telemetryConfig = {
  apislug: '',
  pdata: {
    id: 'atree',
    pid: '0.0.1',
    ver: 'atree',
  },
  env: 'atree',
  channel: '',
  did: 'did',
  authtoken: '',
  userId:
    (typeof window !== 'undefined' && localStorage.getItem('userId')) ||
    'Anonymous',
  uid:
    (typeof window !== 'undefined' && localStorage.getItem('id')) ||
    'Anonymous',
  sid: generateUUID(),
  batchsize: 1,
  mode: '',
  host: hostURL, //TODO: Change this host and endpoint properly
  endpoint: '/v1/telemetry',
  tags: [],
};

if (typeof window !== 'undefined') {
  getDeviceId().then((deviceId) => {
    telemetryConfig.did = deviceId as string;
  });
}

export const telemetryFactory = {
  init: () => {
    if (typeof window !== 'undefined') {
      if (CsTelemetryModule?.instance && !CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.init({});
        CsTelemetryModule.instance.telemetryService.initTelemetry({
          config: telemetryConfig,
          userOrgDetails: {},
        });
      }
    }
  },

  interact: (interactEventInput: { edata: any; context?: any; object?: any; }) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(interactEventInput);
      if (CsTelemetryModule?.instance?.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
          options: eventData.options,
          edata: eventData.edata,
        });
      }
    }
  },

  impression: (impressionEventInput: { edata: any; context?: any; object?: any; }) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(impressionEventInput);
      if (CsTelemetryModule?.instance?.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
          options: eventData.options,
          edata: eventData.edata,
        });
      }
    }
  },

  assess: (assessEventInput: { edata: any; context?: any; object?: any; }) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(assessEventInput);
      if (CsTelemetryModule?.instance?.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry(
          {
            options: eventData.options,
            edata: eventData.edata,
          },
          {} // Add the second argument as required by the method
        );
      }
    }
  },

  response: (responseEventInput: { edata: any; context?: any; object?: any; }) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(responseEventInput);
      if (CsTelemetryModule?.instance?.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry({
          options: eventData.options,
          edata: eventData.edata,
        }, {});
      }
    }
  },

  interrupt: (interactEventInput: { edata: any; context?: any; object?: any; }) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(interactEventInput);
      if (CsTelemetryModule?.instance?.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
          options: eventData.options,
          edata: eventData.edata,
        });
      }
    }
  },

  start: ({ appName, ...edata }: { appName?: string; [key: string]: any }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('id') || 'Anonymous' },
        actor: {
          id: localStorage.getItem('id') || 'Anonymous',
          type: 'Teacher',
        },
        context: {
          type: appName ? appName : 'Standalone',
        },
        edata,
      };
    }
  },

  end: ({ appName, ...edata }: { appName?: string; [key: string]: any }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('id') || 'Anonymous' },
        actor: {
          id: localStorage.getItem('id') || 'Anonymous',
          type: 'Teacher',
        },
        context: {
          type: appName ? appName : 'Standalone',
        },
        edata,
      };
    }
  },
};

function getEventData(eventInput: { edata: any; context?: any; object?: any; sid?: string }) {
  const timestamp = Date.now();
  const event = {
    edata: eventInput.edata,
    options: {
      context: getEventContext(eventInput),
      object: getEventObject(eventInput),
      tags: [],
    },
    ets: timestamp,
  };
  return event;
}

function getEventObject(eventInput: { id?: string; type?: string; ver?: string; rollup?: Record<string, any>; object?: { id?: string; type?: string; ver?: string; rollup?: Record<string, any> } }) {
  if (eventInput.object) {
    const eventObjectData = {
      id: eventInput.object.id || '',
      type: eventInput.object.type || '',
      ver: eventInput.object.ver || '',
      rollup: eventInput.object.rollup || {},
    };
    return eventObjectData;
  } else {
    return {};
  }
}

function getEventContext(eventInput: { edata: any; context?: any; sid?: string }) {
  const eventContextData = {
    channel: eventInput.edata.channel || telemetryConfig.channel,
    pdata: eventInput.context.pdata || telemetryConfig.pdata,
    env: eventInput.context.env || telemetryConfig.env,
    sid: eventInput.sid || telemetryConfig.sid,
    uid:
      (typeof window !== 'undefined' && localStorage.getItem('id')) ||
      telemetryConfig.uid, //user id
    cdata: eventInput.context.cdata || [],
  };
  if (telemetryConfig.sid) {
    eventContextData.cdata.push({
      id: telemetryConfig.sid,
      type: 'UserSession',
    });
  }
  eventContextData.cdata.push({
    id: 'uuid',
    type: 'Device',
  });
  return eventContextData;
}

function getRollUpData(data = []) {
  const rollUp: Record<string, any> = {};
  data.forEach((element, index) => (rollUp['l' + (index + 1)] = element));
  return rollUp;
}
