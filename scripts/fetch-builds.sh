#!/usr/bin/env bash
# Počká na dokončení EAS buildů a stáhne hotové artefakty do ./builds/.
# Použití: bash scripts/fetch-builds.sh <android-build-id> <ios-build-id>
set -u

cd "$(dirname "$0")/.." || exit 1
mkdir -p builds

wait_and_download() {
  local id="$1" label="$2" ext="$3"
  local status url tries=0

  while [ "$tries" -lt 120 ]; do
    status=$(npx eas-cli@latest build:view "$id" --json --non-interactive 2>/dev/null \
      | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)

    case "$status" in
      FINISHED) break ;;
      ERRORED|CANCELED) echo "$label: build skoncil se stavem $status"; return 1 ;;
      "")       echo "$label: stav se nepodarilo zjistit (pokus $tries)" ;;
      *)        echo "$label: $status" ;;
    esac
    tries=$((tries + 1))
    sleep 30
  done

  if [ "$status" != "FINISHED" ]; then
    echo "$label: build se nedokoncil v limitu"
    return 1
  fi

  url=$(npx eas-cli@latest build:view "$id" --json --non-interactive 2>/dev/null \
    | python -c "import sys,json; print((json.load(sys.stdin).get('artifacts') or {}).get('applicationArchiveUrl',''))")

  if [ -z "$url" ]; then
    echo "$label: hotovo, ale chybi odkaz na artefakt"
    return 1
  fi

  echo "$label: stahuji…"
  curl -sL "$url" -o "builds/dotacnicek-$label.$ext" || { echo "$label: stazeni selhalo"; return 1; }
  echo "$label: ulozeno do builds/dotacnicek-$label.$ext"
}

rc=0
wait_and_download "$1" android aab || rc=1
wait_and_download "$2" ios ipa || rc=1

echo "--- obsah builds/ ---"
ls -lh builds/ 2>/dev/null
exit $rc
