import React from 'react'

import Link from 'next/link'

import {
    Container,
    Button
} from 'reactstrap'

export async function getStaticProps() {
    return {
        props: {
            nav: {
                light: true,
                classes: "shadow",
                color: "white",
            },
            title: "404"
        },
    }
}

const ErrorPage = () => {
    return (
        <React.Fragment>
            <div className="mh-full-screen d-flex align-items-center dark-overlay">
                <img src="/content/img/photo/aron-visuals-3jBU9TbKW7o-unsplash.jpg" alt="Not found" className="bg-image" />
                <Container className="text-white text-lg overlay-content py-6 py-lg-0">
                    <h1 className="display-3 font-weight-bold mb-5">Page Not Found</h1>
                    <p className="font-weight-light mb-5">The page you requested couldn't be found - this could be due to a spelling error in the URL or a removed page. </p>
                    <p className="mb-6">
                        <Link href="/">
                            <Button color="outline-light">
                                <i className="fa fa-home mr-2" />Start from the Homepage
                            </Button>
                        </Link></p>
                    <p className="h4 text-shadow">Error 404</p>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ErrorPage;