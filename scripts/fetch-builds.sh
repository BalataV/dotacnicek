#!/usr/bin/env bash
# Počká na dokončení EAS buildů a stáhne hotové artefakty do ./builds/.
#
# Použití: bash scripts/fetch-builds.sh <build-id> [<build-id> …]
#
# Platformu si skript zjistí z EAS sám a podle ní pojmenuje soubor
# (dotacnicek-android-<verze>.aab / dotacnicek-ios-<verze>.ipa). Dřív se
# předávalo <android-id> <ios-id> na pevných pozicích a chybějící platforma se
# vyplňovala slovem „skip" – z volání pak nešlo poznat, co se vlastně staví.
set -u

cd "$(dirname "$0")/.." || exit 1
mkdir -p builds

# eas-cli není v package.json, takže `npx eas-cli@latest` by ho stahoval při
# každém volání (a je jich tu několik na build). Jednou zjistíme cestu a pak
# už voláme přímo.
EAS=$(command -v eas || true)
if [ -z "$EAS" ]; then
  EAS="npx --yes eas-cli@latest"
fi

build_json() { $EAS build:view "$1" --json 2>/dev/null; }

field() { python -c "import sys,json;d=json.load(sys.stdin);print(d.get('$1') or '')"; }

fetch() {
  local id="$1" info status platform ver url label ext tries=0

  while [ "$tries" -lt 120 ]; do
    info=$(build_json "$id")
    status=$(printf '%s' "$info" | field status)

    case "$status" in
      FINISHED) break ;;
      ERRORED|CANCELED) echo "$id: build skoncil se stavem $status"; return 1 ;;
      "")       echo "$id: stav se nepodarilo zjistit (pokus $tries)" ;;
      *)        echo "$id: $status" ;;
    esac
    tries=$((tries + 1))
    sleep 30
  done

  if [ "$status" != "FINISHED" ]; then
    echo "$id: build se nedokoncil v limitu"
    return 1
  fi

  platform=$(printf '%s' "$info" | field platform)
  case "$platform" in
    ANDROID) label=android; ext=aab ;;
    IOS)     label=ios;     ext=ipa ;;
    *)       echo "$id: neznama platforma '$platform'"; return 1 ;;
  esac

  # Verze v názvu souboru – běžně máme rozpracované dvě najednou (jedna
  # v kontrole v obchodě, druhá čerstvá) a přepisovat si je je otrava.
  ver=$(printf '%s' "$info" | python -c "import sys,json;d=json.load(sys.stdin);print('%s-%s' % (d.get('appVersion','x'), d.get('appBuildVersion','x')))")
  url=$(printf '%s' "$info" | python -c "import sys,json;print((json.load(sys.stdin).get('artifacts') or {}).get('applicationArchiveUrl',''))")

  if [ -z "$url" ]; then
    echo "$id: hotovo, ale chybi odkaz na artefakt"
    return 1
  fi

  echo "$id: $platform $ver – stahuji…"
  curl -sL "$url" -o "builds/dotacnicek-$label-$ver.$ext" || { echo "$id: stazeni selhalo"; return 1; }
  echo "$id: ulozeno do builds/dotacnicek-$label-$ver.$ext"
}

if [ "$#" -eq 0 ]; then
  echo "Pouziti: bash scripts/fetch-builds.sh <build-id> [<build-id> …]"
  exit 1
fi

rc=0
for id in "$@"; do
  fetch "$id" || rc=1
done

echo "--- obsah builds/ ---"
ls -lh builds/ 2>/dev/null
exit $rc
