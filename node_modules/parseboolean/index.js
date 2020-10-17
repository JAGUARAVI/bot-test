var parseBool = function(v) {
  if (v == '1') return true;
  if (v == '0') return false;
  if (v == 'undefined') return false;
  if (v == 'null') return false;
  return (v === 'true');
}
module.exports = parseBool