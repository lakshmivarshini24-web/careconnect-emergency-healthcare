import { AuthSession } from '../types';
import { realtimeService } from './realtimeService';

const SESSION_STORAGE_KEY = 'careconnect_auth_session';

type SessionListener = (session: AuthSession | null) => void;

class AuthService {
  private listeners: Set<SessionListener> = new Set();

  /**
   * Get currently active authentication/demo session
   */
  public getSession(): AuthSession | null {
    if (typeof sessionStorage === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthSession;
    } catch (e) {
      console.warn('[AuthService] Failed to parse session from sessionStorage', e);
      return null;
    }
  }

  /**
   * Enter Judge Demo Mode
   * - No pre-created account required
   * - Validates email syntax if provided, but does not pretend it is a real authenticated staff account
   * - Allows blank email for guest judge access
   * - Sets demo data mode on realtimeService
   */
  public enterJudgeDemo(rawEmail?: string): { success: boolean; error?: string; session?: AuthSession } {
    const trimmed = rawEmail?.trim();

    if (trimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return {
          success: false,
          error: 'Please enter a valid email address (e.g. judge@sitams.edu) or leave empty to continue as a guest judge.'
        };
      }
    }

    const session: AuthSession = {
      type: 'judge-demo',
      email: trimmed || undefined,
      displayName: trimmed ? trimmed : 'Hackathon Judge (Guest)',
      isJudgeDemo: true,
      startedAt: new Date().toISOString()
    };

    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch (e) {
        console.warn('[AuthService] Could not persist session to sessionStorage', e);
      }
    }

    // Switch data store to isolated demo namespace
    realtimeService.setMode('demo');

    this.notifyListeners(session);
    return { success: true, session };
  }

  /**
   * Real Hospital Staff Login Attempt
   * - Preserves fields for genuine authorized staff authentication
   * - Rejects arbitrary credentials
   * - Clarifies backend identity provider integration requirements
   */
  public attemptStaffLogin(email: string, password: string): { success: boolean; message: string } {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return {
        success: false,
        message: 'Please provide both staff email and password.'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        success: false,
        message: 'Please enter a syntactically valid staff email address.'
      };
    }

    // Since this prototype currently runs without external SSO/OAuth backend infrastructure,
    // we strictly refuse arbitrary credentials to prevent fake security claims.
    return {
      success: false,
      message: 'Genuine Hospital Staff authentication requires connection to an enterprise identity provider (e.g. Supabase Auth, Firebase Auth, or Hospital OAuth SSO). Arbitrary credentials are not accepted. For the SITAMS × HACKSPHERE evaluation, please click "Enter Judge Demo Mode" below to safely explore administrative controls using simulated data.'
    };
  }

  /**
   * Logout from active session
   * - Clears session
   * - Restores realtime data mode to live
   */
  public logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }

    // Revert data store back to live namespace
    realtimeService.setMode('live');

    this.notifyListeners(null);
  }

  public isJudgeDemoMode(): boolean {
    const session = this.getSession();
    return session?.isJudgeDemo === true;
  }

  public isStaffAuthenticated(): boolean {
    const session = this.getSession();
    return session?.type === 'staff-authenticated';
  }

  public subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(session: AuthSession | null) {
    this.listeners.forEach(fn => {
      try {
        fn(session);
      } catch (e) {
        console.error('[AuthService] Listener error', e);
      }
    });
  }
}

export const authService = new AuthService();
