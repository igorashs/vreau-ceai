import { getQueryElements } from '@/utils/getQueryElements';
import { getValidationErrorDetails } from '@/utils/validator';
import verifySession from '@/utils/verifySession';
import { NextApiSessionRequest } from '@/utils/withSession';
import { NextApiResponse } from 'next';
import { ApiResponse } from 'types';

type Permissions = { isManager?: boolean; isAdmin?: boolean };

export default class ApiRouteService<T> {
  req: NextApiSessionRequest;

  res: NextApiResponse<ApiResponse>;

  constructor(req: NextApiSessionRequest, res: NextApiResponse<ApiResponse>) {
    this.req = req;
    this.res = res;
  }

  /**
   * Get user session
   *
   * * `Use this function in pair with 'isAuthorized' to make sure that a session exists`
   * * Throw Error if session doesn't exist
   *
   * @returns session
   */
  getUserSession = () => {
    const { session } = this.req;
    if (!session) throw new Error('session required');

    const { isAuth, user } = session;
    if (!user) throw new Error('session user required');

    return { isAuth, user };
  };

  /**
   * Get query elements as string only
   *
   * @returns query elements
   */
  getQuery = () => getQueryElements(this.req.query);

  /**
   * Get req.body
   *
   * @returns body
   */
  getBody = () => this.req.body;

  /**
   * Respond with 200 OK
   *
   * * Respond with optional data if provided
   */
  resOk = (data?: T) =>
    this.res.status(200).json({ success: true, message: 'OK', ...data });

  /**
   * Respond with 201 Created
   */
  resCreated = (data?: T) =>
    this.res.status(201).json({ success: true, message: 'Created', ...data });

  /**
   * Respond with 303 Not Modified
   */
  resNotModified = (data?: T) =>
    this.res.status(304).json({
      success: true,
      message: 'Not Modified',
      ...data,
    });

  /**
   * Respond with 400 Bad Request
   */
  resBadRequest = () =>
    this.res.status(400).json({ success: false, message: 'Bad Request' });

  /**
   * Respond with 401 Unauthorized
   */
  resUnauthorized = () =>
    this.res.status(401).json({ success: false, message: 'Unauthorized' });

  /**
   * Respond with 403 Forbidden
   */
  resForbidden = () =>
    this.res.status(403).json({ success: false, message: 'Forbidden' });

  /**
   * Respond with 404 Not Found
   */
  resNotFound = () =>
    this.res.status(404).json({ success: false, message: 'Not Found' });

  /**
   * Check if user is authorized and has required permissions
   *
   *  * Respond 401 Unauthorized if user is not authorized
   *  * Respond 403 Forbidden if user doesn't have required permissions
   * @returns isAuth
   */
  isAuthorized = (perm?: Permissions) => {
    // require session
    if (!this.req.session) {
      this.resUnauthorized();

      return false;
    }

    const { isAuth, user } = this.req.session;

    // require user to be authenticated
    if (!isAuth || !user) {
      this.resUnauthorized();

      return false;
    }

    // require user to be Manager
    if (perm?.isManager && !user.isManager) {
      this.resForbidden();

      return false;
    }

    // require user to be Admin
    if (perm?.isAdmin && !user.isAdmin) {
      this.resForbidden();

      return false;
    }

    // user has required permissions
    return true;
  };

  /**
   * Refresh user session (access token),
   *
   * * Set Set-Cookie Header with new cookies
   *
   * @returns session
   */
  refreshSession = async () => {
    const [session, cookies] = await verifySession({
      cookies: this.req.cookies,
      toUpdate: true,
    });

    if (cookies) this.res.setHeader('Set-Cookie', cookies);

    return session;
  };

  /**
   * Respond with 400 Bad Request status
   *
   * * Respond with Validation Errors if found
   *
   */
  handleApiError = (error: Error) => {
    const details = getValidationErrorDetails(error);

    if (details) {
      this.res.status(400).json({
        success: false,
        message: 'Validation Errors',
        errors: details,
      });
    } else {
      this.resBadRequest();
    }
  };

  /**
   * Respond with 405 Method Not Allowed
   *
   * * Set Allow Header with provided allowed methods
   *
   */
  resMethodNotAllowed = (allowedMethods: string[], method?: string) => {
    this.res.setHeader('Allow', allowedMethods);
    this.res.status(405).json({
      success: false,
      message: `Method ${method} Not Allowed`,
    });
  };
}
