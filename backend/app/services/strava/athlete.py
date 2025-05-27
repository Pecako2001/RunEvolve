import os
import requests

def fetch_athlete_zones(token):
    """
    Fetch the athlete's heart rate and power zones from Strava.

    Parameters
    ----------
    token : str
        A valid Strava access token.

    Returns
    -------
    dict
        The JSON payload for the athlete's zones.

    Raises
    ------
    requests.exceptions.HTTPError
        If the Strava API call fails.
    """
    url = "https://www.strava.com/api/v3/athlete/zones"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json()


def fetch_athlete_stats(token, athlete_id):
    """Fetch overall stats for the athlete."""
    url = f"https://www.strava.com/api/v3/athletes/{athlete_id}/stats"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json()


def fetch_athlete_activities(token, page=1, per_page=30):
    """Fetch athlete activities list."""
    url = "https://www.strava.com/api/v3/athlete/activities"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"page": page, "per_page": per_page}
    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

def fetch_activity_details(activity_id, token, include_all_efforts=True):
    """
    Fetch the full details of a single activity (including all segment efforts).

    Parameters
    ----------
    activity_id : int or str
        The Strava activity ID.
    token : str
        A valid Strava access token.
    include_all_efforts : bool
        Whether to include every segment effort in the response.

    Returns
    -------
    dict
        The JSON payload for the requested activity.

    Raises
    ------
    requests.exceptions.HTTPError
        If the Strava API call fails (e.g. 401, 404, etc.).
    """
    url = f"https://www.strava.com/api/v3/activities/{activity_id}"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"include_all_efforts": str(include_all_efforts).lower()}

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

def fetch_latest_run(token, before=None, after=None, page=1, per_page=10):
    """
    Fetch your most recent Run activity.
    
    Parameters
    ----------
    token : str
        A valid Strava access token.
    before : int or None
        Unix timestamp to only fetch activities before this time.
    after : int or None
        Unix timestamp to only fetch activities after this time.
    page : int
        Page number to fetch (1‐indexed).
    per_page : int
        Number of activities per page.
        
    Returns
    -------
    dict
        The first activity of type "Run".
    
    Raises
    ------
    RuntimeError
        If no recent Run is found.
    HTTPError
        If the Strava API call fails (e.g. 401/403/500).
    """
    url = "https://www.strava.com/api/v3/athlete/activities"
    headers = {"Authorization": f"Bearer {token}"}
    params = {
        "before": before or "",
        "after":  after or "",
        "page":   page,
        "per_page": per_page
    }

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()

    activities = resp.json()
    for act in activities:
        if act.get("type") == "Run":
            return act

    raise RuntimeError("No recent run found.")