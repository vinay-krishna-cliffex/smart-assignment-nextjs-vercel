import React from 'react'
import { useEffect, useState } from "react";

import { Container } from 'reactstrap'

// import ProgressBar from '../components/ProgressBar'
import ListingForm from '../components/ListingForm'
import data from '../data/user-add.json'
import { Button } from 'reactstrap'
export async function getStaticProps() {

    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            loggeduser: true,
            title: "Add your listing",
            listingForm: true
        },
    }
}

const Setting = () => {
 const [usernameState, setUsername] = useState("");
  useEffect(() => {  
    const userId = localStorage.getItem("uidp");
    if (!userId) {
        window.location.href="/login";
    }
    setUsername(userId);

  }, []);

    return (
        <React.Fragment>
            {/* <ProgressBar progress={20} /> */}
            <section className="py-5 remove-last">
                <Container>
                    {/* <p className="subtitle text-primary">
                        {data[1].subtitle}
                    </p> */}
                    <h1 className="h2 mb-5">
                        {data[1].title}
                        {/* <span className="text-muted float-right">Step 1</span> */}
                    </h1>

                    <ListingForm
                        data={data[1]}
                        // nextStep="/user-add-2"
                        
                    />
                    {/* <div className="form-blockh text-right">
                    <Button color="primary">Save</Button>
                    </div> */}
                    

                </Container>
            </section>

        </React.Fragment>
    )
}

export default Setting;