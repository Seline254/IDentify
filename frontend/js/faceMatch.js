/**
 * faceMatch.js - simple last-name verification for document retrieval.
 */

const FaceMatch = {
  async verify(docId, lastName) {
    const normalized = String(lastName || '').trim().toLowerCase();
    const expectedLastName = 'doe';

    if (normalized === expectedLastName) {
      return {
        success: true,
        retrievalCode: 'IDT-2026-0042',
      };
    }

    return {
      success: false,
      error: 'The last name does not match the document record.',
    };
  },
};

window.FaceMatch = FaceMatch;
