(
  printf "Checking Code Style... "
  standard > stdout.tmp 2> stderr.tmp && (
    echo "passed"
  ) || (
    echo "failed" >&2
    cat stderr.tmp >&2
    cat stdout.tmp
    exit 2
  )
) && (
  echo "Testing..."
  node ./test
) && (
  echo "Building..."
  npm run build
) && (
  [[ "$SKIP_START_APP" == 'TRUE' ]] || (
    echo "Starting application..."
    npm start
  )
)
