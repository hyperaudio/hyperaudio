import time
import json
import youtube_dl
from smart_open import open
from contextlib import redirect_stdout


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

    # test download
    # https://stackoverflow.com/questions/59384436/use-youtube-dl-to-download-directly-to-s3
    # ydl_opts = {"outtmpl": "-", "cachedir": False, "logtostderr": True}
    # with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    #     with open(
    #         "s3://hyperaudio-data/test/" + str(time.time()) + "/test.mp4", "wb"
    #     ) as f:
    #         with redirect_stdout(f):
    #             ydl.download([url])

    # ydl_opts = {
    #     "outtmpl": "-",
    #     "cachedir": False,
    #     "logtostderr": True,
    #     "format": "bestaudio/best",
    #     "audioformat": "m4a",
    #     "audioquality": 0,
    #     "postprocessors": [
    #         {
    #             "key": "FFmpegExtractAudio",
    #             "preferredcodec": "m4a",
    #             "preferredquality": "192",
    #         }
    #     ],
    # }
    # with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    #     with open(
    #         "s3://hyperaudio-data/test/" + str(time.time()) + "/test.m4a", "wb"
    #     ) as f:
    #         with redirect_stdout(f):
    #             ydl.download([url])

    return data
