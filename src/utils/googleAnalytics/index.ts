import { AccountType } from '@portkey/services';
import { LoginMethod } from './types';
import { randomId } from '@portkey/utils';
import { asyncLocalStorage } from '../asyncStorage';

export type TAllLoginKey = AccountType | 'Scan';

export type AccountAllType = AccountType | 'Facebook' | 'Twitter';

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports

const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

class Analytics {
  private debug: boolean;
  constructor(debug = false) {
    this.debug = debug;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the page is installed.
  private async getOrCreateClientId() {
    let clientId = await asyncLocalStorage.getItem('clientId');
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = randomId();
      await asyncLocalStorage.setItem('clientId', clientId);
    }
    return clientId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  private async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let sessionData = await asyncLocalStorage.getItem('sessionData');
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData && sessionData.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await asyncLocalStorage.setItem('sessionData', JSON.stringify(sessionData));
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await asyncLocalStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  private async fireEvent(name: string, params: any = {}) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }
    params.clientId = await this.getOrCreateClientId();
    try {
      // TODO this.debug return;
      if (this.debug) return;
      window?.gtag('event', name, params);
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  private async firePageViewOnceEvent(pageTitle: string, pageLocation: string, additionalParams = {}) {
    const pageList: any[] = (await asyncLocalStorage.getItem('page_view_store')) ?? [];
    if (pageList.includes(pageTitle)) return;
    pageList.push(pageTitle);
    asyncLocalStorage.setItem('page_view_store', JSON.stringify(pageList));
    return this.fireEvent('page_view_once', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  // Fire a page view event.
  async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams = {}) {
    this.firePageViewOnceEvent(pageTitle, pageLocation, additionalParams);
    return this.fireEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  async portkeyLoginEvent(loginMethod: LoginMethod, loginType?: AccountAllType, additionalParams = {}) {
    try {
      const params = { timestamp: Date.now(), loginType, loginMethod };

      return this.fireEvent('portkey_sdk_register_end', {
        ...params,
        ...additionalParams,
      });
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }
  async referralInviteFriendsClickEvent(additionalParams = {}) {
    try {
      const params = { timestamp: Date.now() };

      return this.fireEvent('referral_invite_friends_click', {
        ...params,
        ...additionalParams,
      });
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }
}

const googleAnalytics = new Analytics();

export default googleAnalytics;
