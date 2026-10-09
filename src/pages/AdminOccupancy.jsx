import {
    useEffect,
    useState,
  } from 'react'
  
  import {
    getPrimaryCafeteriaId,
    analyzeOccupancy,
    saveManualOccupancy,
  } from '../api/adminApi'
  
  function AdminOccupancy({
    onBack,
  }) {
    const [
      cafeteriaId,
      setCafeteriaId,
    ] = useState(null)
  
    const [
      selectedFile,
      setSelectedFile,
    ] = useState(null)
  
    const [
      previewUrl,
      setPreviewUrl,
    ] = useState('')
  
    const [
      analyzing,
      setAnalyzing,
    ] = useState(false)
  
    const [
      analysisResult,
      setAnalysisResult,
    ] = useState(null)
  
    const [
      currentPeople,
      setCurrentPeople,
    ] = useState('')
  
    const [
      saving,
      setSaving,
    ] = useState(false)
  
    const [
      message,
      setMessage,
    ] = useState('')
  
    const [
      errorMessage,
      setErrorMessage,
    ] = useState('')
  
    useEffect(() => {
      const load = async () => {
        try {
          const id =
            await getPrimaryCafeteriaId()
  
          setCafeteriaId(id)
        } catch (error) {
          setErrorMessage(
            error.message ||
              '학식당 정보를 불러오지 못했습니다.'
          )
        }
      }
  
      load()
    }, [])
  
    // ========================================
    // 이미지 선택
    // ========================================
  
    const handleFileChange = (
      event
    ) => {
      const file =
        event.target.files?.[0]
  
      if (!file) {
        return
      }
  
      const allowedTypes = [
        'image/jpeg',
        'image/png',
      ]
  
      if (
        !allowedTypes.includes(file.type)
      ) {
        setErrorMessage(
          'JPEG 또는 PNG 이미지만 업로드할 수 있습니다.'
        )
        return
      }
  
      if (
        file.size >
        2 * 1024 * 1024
      ) {
        setErrorMessage(
          '이미지는 2MB 이하만 업로드할 수 있습니다.'
        )
        return
      }
  
      setErrorMessage('')
      setMessage('')
      setAnalysisResult(null)
  
      setSelectedFile(file)
  
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        )
      }
  
      setPreviewUrl(
        URL.createObjectURL(file)
      )
    }
  
    // ========================================
    // CLOVA 분석
    // ========================================
  
    const handleAnalyze = async () => {
      if (
        !selectedFile ||
        !cafeteriaId
      ) {
        return
      }
  
      try {
        setAnalyzing(true)
        setErrorMessage('')
        setMessage('')
  
        const result =
          await analyzeOccupancy(
            cafeteriaId,
            selectedFile
          )
  
        setAnalysisResult(result)
  
        setMessage(
          '인원 분석이 완료되었습니다.'
        )
      } catch (error) {
        setErrorMessage(
          error.message ||
            '이미지 분석에 실패했습니다.'
        )
      } finally {
        setAnalyzing(false)
      }
    }
  
    // ========================================
    // 직접 입력
    // ========================================
  
    const handleManualSave =
      async () => {
        const count =
          Number(currentPeople)
  
        if (
          !Number.isInteger(count) ||
          count < 0
        ) {
          setErrorMessage(
            '0 이상의 인원 수를 입력해주세요.'
          )
          return
        }
  
        try {
          setSaving(true)
          setErrorMessage('')
          setMessage('')
  
          await saveManualOccupancy(
            cafeteriaId,
            count
          )
  
          setMessage(
            `현재 이용 인원을 ${count}명으로 저장했습니다.`
          )
        } catch (error) {
          setErrorMessage(
            error.message ||
              '인원 정보를 저장하지 못했습니다.'
          )
        } finally {
          setSaving(false)
        }
      }
  
    const analyzedPeople =
      analysisResult?.currentPeople ??
      analysisResult?.estimatedPeople ??
      analysisResult?.count ??
      null
  
    return (
      <div className="admin-occupancy-page">
  
        <header className="admin-simple-header">
  
          <button
            type="button"
            className="admin-back-button"
            onClick={onBack}
          >
            ‹
          </button>
  
        </header>
  
        <main className="admin-occupancy-content">
  
          <section className="occupancy-title-section">
  
            <div className="occupancy-title-icon">
              ♙
            </div>
  
            <h1>
              사진으로 인원 분석
            </h1>
  
            <p>
              학생식당 사진을 업로드하면
              <br />
              현재 이용 인원을 분석합니다.
            </p>
  
          </section>
  
          {/* 이미지 업로드 */}
  
          <section className="occupancy-upload-card">
  
            <label className="occupancy-upload-area">
  
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="업로드 미리보기"
                  className="occupancy-preview-image"
                />
              ) : (
                <>
                  <span className="occupancy-upload-icon">
                    ▣
                  </span>
  
                  <strong>
                    사진 선택
                  </strong>
  
                  <small>
                    JPEG / PNG · 최대 2MB
                  </small>
                </>
              )}
  
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={
                  handleFileChange
                }
                hidden
              />
  
            </label>
  
            <button
              type="button"
              className="occupancy-analyze-button"
              onClick={handleAnalyze}
              disabled={
                !selectedFile ||
                analyzing
              }
            >
              {analyzing
                ? '이미지를 분석하고 있어요...'
                : '인원 분석하기'}
            </button>
  
            {analyzedPeople !== null && (
              <div className="occupancy-analysis-result">
  
                <span>
                  분석된 현재 이용 인원
                </span>
  
                <strong>
                  {analyzedPeople}
                  <small>명</small>
                </strong>
  
              </div>
            )}
  
          </section>
  
          {/* 직접 인원 입력 */}
  
          <section className="occupancy-manual-section">
  
            <h2>
              직접 인원 입력
            </h2>
  
            <p>
              현재 이용 인원을 직접
              지정할 수 있어요.
            </p>
  
            <label>
              현재 이용 인원
            </label>
  
            <input
              type="number"
              min="0"
              value={currentPeople}
              onChange={(event) =>
                setCurrentPeople(
                  event.target.value
                )
              }
              placeholder="예: 87"
            />
  
            <button
              type="button"
              className="occupancy-save-button"
              onClick={
                handleManualSave
              }
              disabled={saving}
            >
              {saving
                ? '저장 중...'
                : '현재 인원으로 저장'}
            </button>
  
          </section>
  
          {message && (
            <p className="admin-success-message">
              {message}
            </p>
          )}
  
          {errorMessage && (
            <p className="admin-error-message">
              {errorMessage}
            </p>
          )}
  
        </main>
  
      </div>
    )
  }
  
  export default AdminOccupancy