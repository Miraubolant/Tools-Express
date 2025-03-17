import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Enregistrer la police Inter pour le PDF
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

interface StudyInfo {
  name: string;
  orderNumber: string;
  saleName: string;
  logo: string | null;
}

interface LabelsPDFProps {
  studyInfo: StudyInfo;
  labelCount: number;
}

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  labelGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  label: {
    width: '23%',
    height: 'auto',
    aspectRatio: 2,
    margin: '1%',
    padding: 10,
    border: '1pt solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
    height: 'auto',
    maxHeight: 30,
    marginBottom: 5,
    objectFit: 'contain',
  },
  orderNumber: {
    fontSize: 8,
    fontFamily: 'Inter',
    color: '#4B5563',
    marginBottom: 2,
    textAlign: 'center',
  },
  saleName: {
    fontSize: 8,
    fontFamily: 'Inter',
    color: '#4B5563',
    marginBottom: 2,
    textAlign: 'center',
  },
  number: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export const LabelsPDF: React.FC<LabelsPDFProps> = ({ studyInfo, labelCount }) => {
  const labels = Array.from({ length: labelCount }, (_, i) => i + 1);
  const labelsPerPage = 28; // 4x7 labels per page
  const pageCount = Math.ceil(labelCount / labelsPerPage);

  return (
    <Document>
      {Array.from({ length: pageCount }).map((_, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.labelGrid}>
            {labels
              .slice(pageIndex * labelsPerPage, (pageIndex + 1) * labelsPerPage)
              .map((labelNumber) => (
                <View key={labelNumber} style={styles.label}>
                  {studyInfo.logo && (
                    <Image src={studyInfo.logo} style={styles.logo} />
                  )}
                  {studyInfo.orderNumber && (
                    <Text style={styles.orderNumber}>
                      {studyInfo.orderNumber}
                    </Text>
                  )}
                  {studyInfo.saleName && (
                    <Text style={styles.saleName}>{studyInfo.saleName}</Text>
                  )}
                  <Text style={styles.number}>N°{labelNumber}</Text>
                </View>
              ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};