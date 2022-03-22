import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./student.css"

function Student(){
    const [state, setState] = useState(false)
    const [tags, setTags] = useState([
        {
            tag:'',
            studentId:'',
        }
    ]);
    const toggle=()=>{
        setState(!state)
    }
    function handleTag(e, studentId){
        e.preventDefault();
        const customTag = e.target.tag.value;
        setTags([...tags, {tag: customTag, studentId: studentId}])
        console.log(tags)
    }
    const [searchTerm, setSearchTerm] = useState('')
    const url = 'https://api.hatchways.io/assessment/students'
    const [students, setStudents] = useState({
        loading: false,
        data: null,
        error: false
    })

    useEffect(() => {
        setStudents({
            loading: true,
            data: null,
            error: false
        })
        axios.get(url)
            .then(response => {
                setStudents({
                    loading: false,
                    data: response.data.students,
                    error: false
                })
            })
            .catch(() => {
                setStudents({
                    loading: false,
                    data: null,
                    error: true
                })
            })
    }, [url])

    let content = null

    if(students.error){
        content = <p>
            There was an Error Please Refresh.
        </p>
    }

    if(students.loading){
        content = <p>
            Loading...
        </p>
    }

    if(students.data){     
        content =
        students.data.filter((student)=>{
            if (searchTerm == ""){
                return student
            } else if (student.firstName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return student
            }
        }).map((student, key) => {
            const avg = student.grades.reduce((sum, curr) => sum + Number(curr),0)/student.grades.length;
            return(
                <div className='container'>
                    <div className='img-container'>
                        <img className='img-item' src={student.pic}></img>
                    </div>
                    <div className='text-container'>
                        <h1 className='text-name'>{student.firstName} {student.lastName}</h1>
                        <p>Email: {student.email}</p>
                        <p>Company: {student.company}</p>
                        <p>Skill: {student.skill}</p>
                        <p>Average: {avg}</p>
                        <div className={'test-grade-hidden' + (state ? 'test-grade-visible':'')}>
                            <p>Test 1: {student.grades[0]}%</p>
                            <p>Test 2: {student.grades[1]}%</p>
                            <p>Test 3: {student.grades[2]}%</p>
                            <p>Test 4: {student.grades[3]}%</p>
                            <p>Test 5: {student.grades[4]}%</p>
                            <p>Test 6: {student.grades[5]}%</p>
                            <p>Test 7: {student.grades[6]}%</p>
                        </div>

                        {tags.map((tags, index) =>(
                            <div className='tag-box'><p>{tags.tag}</p></div>
                        ))}
                        
                    </div>
                    <div className='button-container'>
                        <button onClick={toggle}><span>&#43;</span></button>
                    </div>
                    <div>
                    </div>
                    <form  onSubmit={(e) => handleTag(e, student.id)}>
                        <input className='tag-input-box' type='text' placeholder='Add a Tag' name='tag'></input>
                    </form>
                </div>
            )
        })
    }


    return(
        <div className='content'>
            <input className='search-bar' type="text" placeholder="Search" onChange={event => {setSearchTerm(event.target.value)}}></input>
            {content}
            
        </div>
    )
}

export default Student