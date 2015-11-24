# !/bin/bash

echo "[{" > words.json
awk -F "," -v q='"' -v c=':' 'FNR > 1 { print q$1q c "{" q "en" q c q$3q "," q "rl" q c q$4q "," q "ph" q c q $8 q "," q "type" q c q $10 q "},"; }' ./_data/dictionary/all.csv >> words.json
echo '"":{}}]' >> words.json
