import csv
import sys
import os
import urllib.request
import urllib.error
import re
from urllib.parse import urlparse, unquote, urlsplit, urlunsplit, quote

# ----------------------------
# helpers
# ----------------------------

def windows_safe_filename(name: str) -> str:
    bad = '<>:"/\\|?*'
    for ch in bad:
        name = name.replace(ch, "-")
    name = name.strip().strip(".")
    if name == "":
        name = "file"
    return name


def filename_from_url(url: str) -> str:
    path = urlparse(url).path
    base = os.path.basename(path)
    base = unquote(base)
    if base == "":
        base = "image.jpg"
    return windows_safe_filename(base)


def normalise_url(url: str) -> str:
    url = (url or "").strip()
    url = re.sub(r"[\x00-\x1F\x7F]", "", url)
    url = re.sub(r"\s+", " ", url)

    parts = urlsplit(url)
    clean_path = quote(parts.path, safe="/")
    return urlunsplit((parts.scheme, parts.netloc, clean_path, parts.query, parts.fragment))


def download_file(url: str, dest_path: str):
    url = normalise_url(url)

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; EnvyImageDownloader/1.0)"}
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()

    with open(dest_path, "wb") as f:
        f.write(data)


# ----------------------------
# main
# ----------------------------

def main(csv_path: str, out_dir: str, max_downloads: int):
    os.makedirs(out_dir, exist_ok=True)

    mapping_path = os.path.join(out_dir, "_image_mapping.csv")
    missing_path = os.path.join(out_dir, "_missing_images.csv")

    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)

        image_cols = [c for c in reader.fieldnames or [] if c and c.strip().upper().startswith("IMAGE")]

        print("CSV:", csv_path)
        print("IMAGE columns detected:", image_cols)
        print("Output folder:", out_dir)
        print("Max downloads:", max_downloads)
        print("-" * 60)

        mapping_file = open(mapping_path, "w", encoding="utf-8", newline="")
        mapping_writer = csv.writer(mapping_file)
        mapping_writer.writerow([
            "Variant SKU",
            "Title",
            "Image Column",
            "Original URL",
            "Local Filename",
            "Local Path"
        ])

        missing_file = open(missing_path, "w", encoding="utf-8", newline="")
        missing_writer = csv.writer(missing_file)
        missing_writer.writerow([
            "Variant SKU",
            "Title",
            "Image Column",
            "Original URL",
            "Reason"
        ])

        seen_urls = set()
        downloaded = 0
        failed = 0
        row_count = 0

        for row in reader:
            row_count += 1
            sku = (row.get("Variant SKU") or "").strip()
            title = (row.get("Title") or "").strip()

            if not sku:
                continue

            for col in image_cols:
                url = (row.get(col) or "").strip()
                if not url:
                    continue

                filename = filename_from_url(url)
                dest_path = os.path.join(out_dir, filename)

                mapping_writer.writerow([sku, title, col, url, filename, dest_path])

                if url in seen_urls:
                    continue
                seen_urls.add(url)

                if downloaded >= max_downloads:
                    continue

                if os.path.exists(dest_path):
                    continue

                try:
                    print("Downloading:", url)
                    download_file(url, dest_path)
                    print(" Saved as:", dest_path)
                    downloaded += 1

                except urllib.error.HTTPError as e:
                    failed += 1
                    missing_writer.writerow([sku, title, col, url, f"HTTP {e.code}"])
                    print(" !! Skipped (HTTP", e.code, ")")

                except Exception as e:
                    failed += 1
                    missing_writer.writerow([sku, title, col, url, str(e)])
                    print(" !! Failed:", e)

        mapping_file.close()
        missing_file.close()

        print("-" * 60)
        print("Total rows read:", row_count)
        print("Unique image URLs:", len(seen_urls))
        print("Downloaded:", downloaded)
        print("Failed / Missing:", failed)
        print("Mapping saved to:", mapping_path)
        print("Missing list saved to:", missing_path)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print('Usage: python scripts\\download_shopify_images.py "<csv_path>" "<output_folder>" <max_downloads>')
        sys.exit(1)

    csv_path = sys.argv[1]
    out_dir = sys.argv[2]
    max_downloads = int(sys.argv[3])

    main(csv_path, out_dir, max_downloads)
