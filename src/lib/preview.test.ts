import { fetchLinkPreview } from './preview';

// Mock got
jest.mock('got', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock cheerio
jest.mock('cheerio', () => ({
  load: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockGot = require('got').default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockCheerio = require('cheerio');

describe('fetchLinkPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected interface structure', async () => {
    const mockHtml = '<html><head><title>Test</title></head></html>';

    // Mock cheerio to handle all selector patterns
    const mock$ = jest.fn((selector) => {
      const mockElement = {
        attr: jest.fn().mockReturnValue(undefined),
        text: jest.fn(),
        first: jest.fn(),
      };

      // Handle different selector patterns
      if (selector.includes('meta[name=') || selector.includes('meta[property=')) {
        mockElement.attr.mockReturnValue(undefined);
      } else if (selector === 'title') {
        mockElement.first.mockReturnValue({ text: () => 'Test Page' });
      } else if (selector === 'img') {
        mockElement.first.mockReturnValue({ attr: () => undefined });
      } else if (selector.includes('link[rel=')) {
        mockElement.attr.mockReturnValue(undefined);
      }

      return mockElement;
    });

    mockGot.mockReturnValue({
      text: () => Promise.resolve(mockHtml),
    });

    mockCheerio.load.mockReturnValue(mock$);

    const result = await fetchLinkPreview('https://example.com');

    // Verify the function returns the expected interface
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('image');
    expect(result).toHaveProperty('logo');
    expect(result).toHaveProperty('url');
    expect(result.url).toBe('https://example.com');
  });

  it('extracts basic meta tags from HTML', async () => {
    const mockHtml = '<html><head><title>Test</title></head></html>';

    // Create a simple mock for cheerio
    const mock$ = jest.fn((selector) => {
      const mockElement = {
        attr: jest.fn(),
        text: jest.fn(),
        first: jest.fn(),
      };

      if (selector === 'meta[property="og:title"]') {
        mockElement.attr.mockReturnValue('OG Title');
      } else if (selector === 'meta[property="og:description"]') {
        mockElement.attr.mockReturnValue('OG Description');
      } else if (selector === 'meta[property="og:image"]') {
        mockElement.attr.mockReturnValue('/images/og.jpg');
      } else if (selector === 'link[rel="icon"]') {
        mockElement.attr.mockReturnValue('/favicon.ico');
      } else if (selector === 'title') {
        mockElement.first.mockReturnValue({ text: () => 'Test Page' });
      } else {
        mockElement.attr.mockReturnValue(undefined);
      }

      return mockElement;
    });

    mockGot.mockReturnValue({
      text: () => Promise.resolve(mockHtml),
    });

    mockCheerio.load.mockReturnValue(mock$);

    const result = await fetchLinkPreview('https://example.com');

    expect(result.title).toBe('OG Title');
    expect(result.description).toBe('OG Description');
    expect(result.image).toBe('https://example.com/images/og.jpg');
    expect(result.logo).toBe('https://example.com/favicon.ico');
    expect(result.url).toBe('https://example.com');
  });

  it('handles missing meta tags gracefully', async () => {
    const mockHtml = '<html><body>No meta tags</body></html>';

    const mock$ = jest.fn((selector) => {
      const mockElement = {
        attr: jest.fn().mockReturnValue(undefined),
        text: jest.fn(),
        first: jest.fn(),
      };

      // Handle different selector patterns
      if (selector.includes('meta[name=') || selector.includes('meta[property=')) {
        mockElement.attr.mockReturnValue(undefined);
      } else if (selector === 'title') {
        mockElement.first.mockReturnValue({ text: () => undefined });
      } else if (selector === 'img') {
        mockElement.first.mockReturnValue({ attr: () => undefined });
      } else if (selector.includes('link[rel=')) {
        mockElement.attr.mockReturnValue(undefined);
      }

      return mockElement;
    });

    mockGot.mockReturnValue({
      text: () => Promise.resolve(mockHtml),
    });

    mockCheerio.load.mockReturnValue(mock$);

    const result = await fetchLinkPreview('https://example.com');

    expect(result.title).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.image).toBeUndefined();
    expect(result.logo).toBeUndefined();
    expect(result.url).toBe('https://example.com');
  });
});
