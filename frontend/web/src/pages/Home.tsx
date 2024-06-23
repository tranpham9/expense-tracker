import { useState } from "react";

import Modal from "../components/Modal";

export default function Home() {
    let [isModalOpen, setIsModalOpen] = useState(true);
    return (
        <>
            <p>This is the home page.</p>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} shouldCloseOnLostFocus={true}>
                <>
                    <h1>The login/signup popup will look like this</h1>
                    <p>Sample Text.</p>
                </>
            </Modal>
        </>
    );
}
