import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UploadCloud, FileText, Image as ImageIcon, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';


import * as DocumentPicker from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

export interface FileData {
  uri: string;
  name: string;
  type: string;
}

interface UploadCardProps {
  label: string;
  type: 'image' | 'document';
  value: FileData | null;
  onChange: (file: FileData | null) => void;
  error?: string;
  placeholder?: string;
}

const UploadCard: React.FC<UploadCardProps> = ({ label, type, value, onChange, error, placeholder }) => {
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pdfRef = React.useRef<React.ElementRef<typeof Pdf>>(null);

  const handleUpload = async () => {


    try {
      if (type === 'image') {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          onChange({
            uri: asset.uri || '',
            name: asset.fileName || 'image.jpg',
            type: asset.type || 'image/jpeg',
          });
        }
      } else {
        const [res] = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
          copyTo: 'cachesDirectory',
        });
        if (res) {
          try {
            const fileName = res.name || 'document.pdf';
            const cacheDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
            const destPath = `${cacheDir}/${fileName}`;

            // Manually copy the file to cache to ensure we have a valid file:// URI
            // this is more reliable than DocumentPicker's copyTo on some Android versions
            await ReactNativeBlobUtil.fs.cp(res.uri, destPath);

            onChange({
              uri: `file://${destPath}`,
              name: fileName,
              type: res.type || 'application/pdf',
            });
          } catch (copyError) {
            console.error('File copy error:', copyError);
            // Fallback to original URI if copy fails
            onChange({
              uri: res.uri,
              name: res.name || 'document.pdf',
              type: res.type || 'application/pdf',
            });
          }
        }



      }
    } catch (err: any) {
      console.error('Upload Error: ', err);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {value ? (
        <View style={styles.fileCard}>
          <View style={styles.fileInfo}>
            {type === 'image' ? (
              <View style={styles.imagePreviewFull}>
                {value.uri ? (
                  <Image source={{ uri: value.uri }} style={styles.imagePreviewBig} />
                ) : (
                  <ImageIcon size={wp('8%')} color={Colors.textSecondary} />
                )}
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageNameText} numberOfLines={1}>{value.name}</Text>
                  <TouchableOpacity onPress={handleRemove} style={styles.removeBtnOverlay}>
                    <X size={wp('4%')} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.pdfPreviewCard}>
                <View style={styles.pdfHeader}>
                  <View style={styles.pdfHeaderLeft}>
                    <View style={styles.pdfIconCircle}>
                      <FileText size={wp('5%')} color={Colors.textPrimary} />
                    </View>
                    <View>
                      <Text style={styles.pdfName} numberOfLines={1}>{value.name}</Text>
                      <Text style={styles.pdfDate}>Uploaded {new Date().toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <CheckCircle2 size={wp('6%')} color={Colors.success} />
                </View>

                {/* Actual PDF Preview Area */}
                <View style={styles.pdfContentWrapper}>
                  <Pdf
                    ref={pdfRef}
                    key={value.uri}
                    source={{ uri: value.uri, cache: false }}
                    page={currentPage}
                    style={styles.pdfPreview}
                    trustAllCerts={false}
                    renderActivityIndicator={() => (
                      <ActivityIndicator color={Colors.primary} size="large" />
                    )}
                    onError={(error) => {
                      console.log('PDF Error:', error);
                    }}
                    onLoadComplete={(numberOfPages) => {
                      setTotalPages(numberOfPages);
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page) => {
                      setCurrentPage(page);
                    }}
                    enablePaging={true}
                    singlePage={false}
                  />




                  {totalPages > 1 && (
                    <View style={styles.paginationRow}>
                      <TouchableOpacity 
                        style={[styles.pageBtn, currentPage === 1 && { opacity: 0.5 }]} 
                        onPress={() => {
                          if (currentPage > 1) {
                            pdfRef.current?.setPage(currentPage - 1);
                          }
                        }}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={wp('5%')} color={Colors.textSecondary} />
                      </TouchableOpacity>
                      
                      <View style={styles.pageIndicator}>
                        <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={[styles.pageBtn, currentPage === totalPages && { opacity: 0.5 }]} 
                        onPress={() => {
                          if (currentPage < totalPages) {
                            pdfRef.current?.setPage(currentPage + 1);
                          }
                        }}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={wp('5%')} color={Colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  )}

                </View>



                {/* <TouchableOpacity style={styles.cvOptionsBtn}>
                  <Settings size={wp('4%')} color={Colors.primary} />
                  <Text style={styles.cvOptionsText}>CV options</Text>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={handleRemove} style={styles.removeAbsolute}>
                  <X size={wp('5%')} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.uploadBox, error ? styles.errorBorder : null]}
          onPress={handleUpload}
          activeOpacity={0.7}
        >
          <UploadCloud size={wp('8%')} color={Colors.textSecondary} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>{placeholder || `Tap to upload ${type}`}</Text>
          <Text style={styles.uploadSubText}>
            {type === 'image' ? 'JPG, PNG max 5MB' : 'PDF, DOCX max 10MB'}
          </Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1.5%'),
    width: '100%',
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: hp('0.6%'),
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: wp('3%'),
    paddingVertical: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  uploadIcon: {
    marginBottom: hp('1%'),
  },
  uploadText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  uploadSubText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  fileCard: {
    width: '100%',
  },
  fileInfo: {
    width: '100%',
  },
  textContainer: {
    marginLeft: wp('3%'),
    flex: 1,
  },
  imagePreviewFull: {
    width: '100%',
    height: hp('25%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  imagePreviewBig: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageNameText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    flex: 1,
  },
  removeBtnOverlay: {
    padding: wp('1.5%'),
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: wp('5%'),
  },
  removeBtnSmall: {
    padding: wp('2%'),
  },
  pdfPreviewCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: wp('4%'),
    width: '100%',
    position: 'relative',
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  pdfHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  pdfIconCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfName: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    maxWidth: wp('50%'),
  },
  pdfDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pdfContentWrapper: {
    height: hp('30%'),
    backgroundColor: '#F8F9FA',
    borderRadius: wp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfPreview: {
    flex: 1,
    width: wp('80%'),
    height: hp('30%'),
    backgroundColor: '#F8F9FA',
  },

  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: hp('1%'),
    gap: wp('4%'),
  },
  pageBtn: {
    padding: wp('1%'),
    backgroundColor: Colors.white,
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageIndicator: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cvOptionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '08',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2.5%'),
    marginTop: hp('2%'),
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    gap: wp('2%'),
  },
  cvOptionsText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
  },
  removeAbsolute: {
    position: 'absolute',
    top: -hp('1%'),
    right: -wp('2%'),
    backgroundColor: Colors.white,
    borderRadius: wp('5%'),
    padding: wp('1%'),
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  previewContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fileStatus: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '600',
    marginTop: hp('0.2%'),
  },
  fileName: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  errorBorder: {
    borderColor: Colors.danger,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: hp('0.5%'),
  },
});

export default UploadCard;
