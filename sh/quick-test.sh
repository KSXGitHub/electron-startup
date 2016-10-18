echo 'Starting electron...'
electron ./app && (
  echo 'Quick Test succeed.'
  exit 0
) || (
  echo 'Quick Test failed.' >&2
  exit 1
)
