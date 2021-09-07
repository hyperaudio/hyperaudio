import json
import youtube_dl


def handler(event, context):
    url = event["url"]

    ydl_opts = {
        "skip_download": True,
        "quiet": True,
        "no_warnings": True,
        "no_call_home": True,
        "no_check_certificate": True,
        "prefer_free_formats": True,
        "youtube_skip_dash_manifest": True,
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        data = ydl.extract_info(url)

    return data
