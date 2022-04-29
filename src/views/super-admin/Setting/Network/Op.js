import React from 'react'
import Layout from 'views/super-admin/Layouts';
import Navigation from '../Component/Navigation';
import Network from './Network';
import './Op.css';
export default function Op() {
    return (
        <Layout>
            <div className="content-body">
                <Navigation/>
                <div className="container-fluid">
                    <hr className="main" />
                    {/* Add Network Table File */}
                    <Network/>
                    {/*// Add Network Table File */}

                </div>
            </div>
        </Layout>
    )
}
