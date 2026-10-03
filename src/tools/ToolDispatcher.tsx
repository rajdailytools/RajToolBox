import React from 'react';
import { ToolItem } from '../types';
import {
  PdfMergerComponent,
  PdfSplitterComponent,
  ImageToPdfComponent,
  PdfWatermarkComponent,
  PdfMetadataViewerComponent
} from './components/PdfTools';
import {
  ImageCompressorComponent,
  ImageResizerComponent,
  ImageFormatConverterComponent,
  ImageCropperComponent,
  FaviconGeneratorComponent,
  ImageColorPickerComponent
} from './components/ImageTools';
import {
  WordCounterComponent,
  CaseConverterComponent,
  TextCleanerComponent,
  FindReplaceComponent,
  TextDiffComponent,
  SlugGeneratorComponent
} from './components/TextTools';
import {
  JsonFormatterComponent,
  Base64Component,
  UrlCodecComponent,
  JwtDecoderComponent,
  UuidGeneratorComponent,
  HashGeneratorComponent,
  RegexTesterComponent,
  ColorConverterComponent
} from './components/DeveloperTools';
import { QrCodeComponent, BarcodeComponent } from './components/QrBarcodeTools';
import {
  UniversalUnitConverterComponent,
  NumberSystemComponent,
  RomanNumeralComponent,
  NumberToWordsComponent
} from './components/ConverterTools';
import {
  MetaTagGeneratorComponent,
  RobotsTxtComponent,
  UtmBuilderComponent,
  KeywordDensityComponent,
  SocialPostFormatterComponent
} from './components/SeoSocialTools';
import {
  CsvJsonComponent,
  PomodoroComponent,
  StopwatchComponent,
  PasswordGeneratorComponent,
  RandomPickerComponent,
  ColorPaletteComponent,
  DaysBetweenDatesComponent,
  AgeCalculatorComponent,
  PercentageCalculatorComponent,
  RatioCalculatorComponent,
  AverageCalculatorComponent,
  TallyCounterComponent,
  LoanEmiCalculatorComponent,
  TipDiscountCalculatorComponent
} from './components/ProductivityMathTools';

interface ToolDispatcherProps {
  tool: ToolItem;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({ tool }) => {
  switch (tool.slug) {
    // PDF
    case 'pdf-merger':
      return <PdfMergerComponent />;
    case 'pdf-splitter':
      return <PdfSplitterComponent />;
    case 'image-to-pdf':
      return <ImageToPdfComponent />;
    case 'pdf-watermark':
      return <PdfWatermarkComponent />;
    case 'pdf-metadata-viewer':
      return <PdfMetadataViewerComponent />;

    // Image
    case 'image-compressor':
      return <ImageCompressorComponent />;
    case 'image-resizer':
      return <ImageResizerComponent />;
    case 'image-format-converter':
      return <ImageFormatConverterComponent />;
    case 'image-cropper':
      return <ImageCropperComponent />;
    case 'favicon-generator':
      return <FaviconGeneratorComponent />;
    case 'image-color-picker':
      return <ImageColorPickerComponent />;

    // Text
    case 'word-counter':
      return <WordCounterComponent />;
    case 'case-converter':
      return <CaseConverterComponent />;
    case 'text-cleaner':
      return <TextCleanerComponent />;
    case 'find-and-replace':
      return <FindReplaceComponent />;
    case 'text-diff-checker':
      return <TextDiffComponent />;
    case 'slug-generator':
      return <SlugGeneratorComponent />;

    // Developer
    case 'json-formatter':
      return <JsonFormatterComponent />;
    case 'base64-codec':
      return <Base64Component />;
    case 'url-codec':
      return <UrlCodecComponent />;
    case 'jwt-decoder':
      return <JwtDecoderComponent />;
    case 'uuid-generator':
      return <UuidGeneratorComponent />;
    case 'hash-generator':
      return <HashGeneratorComponent />;
    case 'regex-tester':
      return <RegexTesterComponent />;
    case 'color-converter':
      return <ColorConverterComponent />;

    // QR & Barcode
    case 'qr-code-generator':
      return <QrCodeComponent />;
    case 'barcode-generator':
      return <BarcodeComponent />;

    // Converters
    case 'universal-unit-converter':
      return <UniversalUnitConverterComponent />;
    case 'number-system-converter':
      return <NumberSystemComponent />;
    case 'roman-numeral-converter':
      return <RomanNumeralComponent />;
    case 'number-to-words':
      return <NumberToWordsComponent />;

    // SEO & Web
    case 'meta-tag-generator':
      return <MetaTagGeneratorComponent />;
    case 'robots-txt-generator':
      return <RobotsTxtComponent />;
    case 'utm-builder':
      return <UtmBuilderComponent />;
    case 'keyword-density-checker':
      return <KeywordDensityComponent />;

    // Social Media
    case 'social-post-formatter':
      return <SocialPostFormatterComponent />;
    case 'hashtag-formatter':
      return <SocialPostFormatterComponent />;

    // File & Data
    case 'csv-to-json':
    case 'json-to-csv':
      return <CsvJsonComponent />;

    // Productivity
    case 'pomodoro-timer':
      return <PomodoroComponent />;
    case 'stopwatch-timer':
      return <StopwatchComponent />;
    case 'password-generator':
      return <PasswordGeneratorComponent />;
    case 'random-decision-picker':
      return <RandomPickerComponent />;
    case 'color-palette-generator':
      return <ColorPaletteComponent />;

    // Date & Time
    case 'days-between-dates':
      return <DaysBetweenDatesComponent />;
    case 'age-calculator':
      return <AgeCalculatorComponent />;

    // Educational
    case 'percentage-calculator':
      return <PercentageCalculatorComponent />;
    case 'ratio-proportion-calculator':
      return <RatioCalculatorComponent />;
    case 'average-calculator':
      return <AverageCalculatorComponent />;

    // Everyday Utilities
    case 'tally-counter':
      return <TallyCounterComponent />;

    // Finance & Calculators
    case 'loan-emi-calculator':
      return <LoanEmiCalculatorComponent />;
    case 'tip-discount-calculator':
      return <TipDiscountCalculatorComponent />;

    default:
      return <UniversalUnitConverterComponent />;
  }
};
