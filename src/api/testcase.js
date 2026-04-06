import { isMockMode } from './useMockMode.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function getMockData(form) {
  return [
    {
      id: 'TC-001',
      programName: 'MBR_DOWN_UP_01',
      testData: '회원번호: M001, 이름: 홍길동',
      title: `[정상] ${form.title} - 다운로드 기능 동작 확인`,
      precondition: '로그인 상태이며 회원 데이터가 1건 이상 존재한다.',
      steps: ['회원정보 관리 화면에 접속한다.', '다운로드 버튼을 클릭한다.', 'Excel 파일이 다운로드됨을 확인한다.'],
      expected: 'Excel 파일이 정상적으로 다운로드되고 회원 데이터가 정확히 포함되어 있다.',
      priority: 'high',
      category: form.isNew === 'new' ? '신규기능' : '수정기능'
    },
    {
      id: 'TC-002',
      programName: 'MBR_DOWN_UP_01',
      testData: 'sample_upload.xlsx (5건)',
      title: `[정상] ${form.title} - 업로드 기능 동작 확인`,
      precondition: '올바른 형식의 Excel 파일이 준비되어 있다.',
      steps: ['회원정보 관리 화면에 접속한다.', '업로드 버튼을 클릭하여 파일을 선택한다.', '업로드 완료 메시지를 확인한다.', '업로드된 데이터가 그리드에 반영됨을 확인한다.'],
      expected: '파일이 정상 업로드되고 그리드에 데이터가 갱신된다.',
      priority: 'high',
      category: form.isNew === 'new' ? '신규기능' : '수정기능'
    },
    {
      id: 'TC-003',
      programName: 'MBR_DOWN_UP_02',
      testData: 'invalid_file.pdf',
      title: `[예외] ${form.title} - 잘못된 형식 파일 업로드 시 오류 처리`,
      precondition: '.xlsx 형식이 아닌 파일이 준비되어 있다.',
      steps: ['업로드 버튼을 클릭한다.', '잘못된 형식의 파일을 선택한다.', '오류 메시지 표시 여부를 확인한다.'],
      expected: '"지원하지 않는 파일 형식입니다." 오류 메시지가 표시되고 업로드가 중단된다.',
      priority: 'medium',
      category: '예외처리'
    },
    {
      id: 'TC-004',
      programName: 'MBR_DOWN_UP_02',
      testData: 'empty.xlsx (0건)',
      title: `[예외] ${form.title} - 빈 파일 업로드 시 처리`,
      precondition: '데이터가 없는 빈 Excel 파일이 준비되어 있다.',
      steps: ['업로드 버튼을 클릭한다.', '빈 Excel 파일을 선택하여 업로드한다.', '결과 메시지를 확인한다.'],
      expected: '"업로드할 데이터가 없습니다." 메시지가 표시된다.',
      priority: 'medium',
      category: '예외처리'
    },
    {
      id: 'TC-005',
      programName: 'MBR_DOWN_UP_03',
      testData: 'large_data.xlsx (10,001건)',
      title: `[경계] ${form.title} - 대용량 파일 업로드 처리`,
      precondition: '10,000건 이상의 데이터를 포함한 Excel 파일이 준비되어 있다.',
      steps: ['대용량 Excel 파일을 업로드한다.', '로딩 인디케이터 표시 여부를 확인한다.', '업로드 완료 후 데이터 정합성을 확인한다.'],
      expected: '로딩 인디케이터가 표시되고 업로드 완료 후 모든 데이터가 정확히 반영된다.',
      priority: 'low',
      category: '성능'
    },
    {
      id: 'TC-006',
      programName: 'MBR_DOWN_UP_01',
      testData: '회원번호: M001~M010',
      title: `[정상] ${form.title} - 다운로드 파일 컬럼 구조 검증`,
      precondition: '회원 데이터가 존재하고 다운로드 권한이 있다.',
      steps: ['회원정보 관리 화면에 접속한다.', '다운로드 버튼을 클릭하여 파일을 받는다.', '다운로드된 Excel 파일을 열어 컬럼 항목을 확인한다.'],
      expected: '회원번호, 이름, 이메일 등 정의된 컬럼이 모두 포함되어 있다.',
      priority: 'medium',
      category: '신규기능'
    },
    {
      id: 'TC-007',
      programName: 'MBR_DOWN_UP_02',
      testData: 'no_column.xlsx (회원번호 누락)',
      title: `[예외] ${form.title} - 필수 컬럼 누락 파일 업로드 시 오류 처리`,
      precondition: '필수 컬럼이 빠진 Excel 파일이 준비되어 있다.',
      steps: ['업로드 버튼을 클릭한다.', '필수 컬럼이 누락된 파일을 선택하여 업로드한다.', '오류 메시지 내용을 확인한다.'],
      expected: '"필수 컬럼(회원번호)이 누락되었습니다." 오류 메시지가 표시된다.',
      priority: 'high',
      category: '예외처리'
    },
    {
      id: 'TC-008',
      programName: 'MBR_DOWN_UP_02',
      testData: '사용자 ID: USER_NO_AUTH',
      title: `[예외] ${form.title} - 권한 없는 사용자 다운로드 시도`,
      precondition: '다운로드 권한이 없는 계정으로 로그인되어 있다.',
      steps: ['회원정보 관리 화면에 접속한다.', '다운로드 버튼 표시 여부를 확인한다.', '직접 URL로 다운로드를 시도한다.'],
      expected: '다운로드 버튼이 비활성화되거나 미표시되고, 직접 접근 시 권한 오류가 반환된다.',
      priority: 'high',
      category: '예외처리'
    }
  ]
}

export async function generateTestCases(form) {
  if (isMockMode.value) {
    await new Promise(r => setTimeout(r, 800))
    return getMockData(form)
  }

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || '테스트케이스 생성에 실패했습니다.')
  }

  return json.data
}
