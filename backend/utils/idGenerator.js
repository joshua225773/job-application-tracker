/**
 * Extracts a normalized 3-letter uppercase prefix from a company name.
 * Strips non-alphanumeric characters and pads with 'X' if fewer than 3 characters.
 * Example: 'Infosys' -> 'INF', 'Google' -> 'GOO', 'HP' -> 'HPX'
 *
 * @param {string} companyName
 * @returns {string} 3-letter uppercase prefix
 */
const extractCompanyCode = (companyName) => {
  if (!companyName || typeof companyName !== 'string') {
    return 'APP';
  }

  const sanitized = companyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (sanitized.length >= 3) {
    return sanitized.substring(0, 3);
  }

  return sanitized.padEnd(3, 'X');
};

/**
 * Generates next auto-incrementing application ID for a given company.
 * Format: JA-<PREFIX>-<001>
 * 
 * @param {import('mongoose').Model} Model - The JobApplication Mongoose Model
 * @param {string} companyName - Target company name
 * @returns {Promise<string>} e.g. JA-INF-001
 */
const generateApplicationId = async (Model, companyName) => {
  const companyCode = extractCompanyCode(companyName);
  const prefixRegex = new RegExp(`^JA-${companyCode}-(\\d{3})$`);

  // Query all existing IDs with this company prefix
  const matchingRecords = await Model.find(
    { applicationId: prefixRegex },
    { applicationId: 1 }
  ).lean();

  let highestSequence = 0;

  for (const record of matchingRecords) {
    const match = record.applicationId.match(prefixRegex);
    if (match && match[1]) {
      const seqNum = parseInt(match[1], 10);
      if (!isNaN(seqNum) && seqNum > highestSequence) {
        highestSequence = seqNum;
      }
    }
  }

  const nextSequence = highestSequence + 1;
  const paddedSequence = String(nextSequence).padStart(3, '0');

  return `JA-${companyCode}-${paddedSequence}`;
};

module.exports = {
  extractCompanyCode,
  generateApplicationId,
};
