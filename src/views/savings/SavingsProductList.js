import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CForm,
  CCardFooter,
  CButton,
  CCardGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import { useAsync } from "react-async";
import axios from 'axios';
import moment from 'moment';

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = [
  {key : '상품명'},
  {key : '상품요약'},
  {key : '금리'}, 
  {key : '종류'}, 
  {key : '최소기간'},
  {key : '최대기간'},
  {key : '등록일'},
  {key : '수정', label: ''}
]
async function getUsers() {
  const response = await axios.get(
      '/savings/SavingsProductList'
  );
  
  return response.data;
}

const SavingsProductList = ({match}) => {
    const { data: accData2, error, isLoading, reload } = useAsync({
      promiseFn: getUsers
    });
    
    if(match.params.J_NAME == 1){
      alert("판매종료 되었습니다.");
      match.params.J_NAME=0;
    }else if(match.params.J_NAME == 2) {
      alert("수정되었습니다.");
      match.params.J_NAME=0;
    }
   
    const history = useHistory()
    const [isOpen, setIsOpen] = useState(false)

    if (isLoading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!accData2) return <button onClick={reload}>불러오기</button>;

    const timestamp = Date.now();
    
  return (
    <>
      <CRow>
        <CCol xs="12" lg="10">
          <CCard>
            <CCardHeader>
              적금상품리스트
              <DocsLink name="CModal"/>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={accData2}
              fields={fields}
              itemsPerPage={5}
              pagination
              items-per-page-select
              scopedSlots = {{
                '금리':
                  (item)=>(
                    <td>{item.금리.toFixed(1)}%</td>
                  ),
                '등록일':
                (item)=>(
                  <td>{item.등록일}</td>
                ),
                '최소기간':
                (item)=>(
                  <td>{item.최소기간}개월</td>
                ),
                '최대기간':
                (item)=>(
                  <td>{item.최대기간}개월</td>
                ),
                '수정':
                  (item)=>(
                    <td style={{textAlign:'center'}}>
                      <CButton type="submit" size="sm" color="warning"  style={{float:"left"}} onClick={() => history.push(`/savings/SavingsModify/${item.상품명}`)}>수정</CButton>
                      <span style={{float:"left"}}>　</span>
                      {item.상품요약!=="상품판매종료"?  <CForm action="/savings/SavingsProductList/1" method="post" style={{float:"left"}}>
                         <input type="hidden" name="J_NAME" value={item.상품명}></input>
                        <CButton type="submit" size="sm" color="danger">종료</CButton>
                      </CForm>:""}
                     
                    </td>
                  ),
              }}
              >
            </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>  
    </>
  )
}

export default SavingsProductList