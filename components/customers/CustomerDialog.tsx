"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Customer } from "@/lib/api/models/customer.dto"

type CustomerDialogProps = {
    customer: Customer | null
    isEditMode: boolean
    visible: boolean
    onOpenChange: (open: boolean) => void
    onSave: (customer: Customer) => Promise<void>
}

export default function CustomerDialog({
    customer,
    isEditMode,
    visible,
    onOpenChange,
    onSave,
}: CustomerDialogProps) {

    const [firstName, setFirstName] = useState(customer?.firstName || "")
    const [lastName, setLastName] = useState(customer?.lastName || "")
    const formRef = useRef<HTMLFormElement | null>(null)

    useEffect(() => {
        setFirstName(customer?.firstName || "")
        setLastName(customer?.lastName || "")
    }, [customer])

    const actionLabel = isEditMode ? "Edit" : "Create"
    const isSaveDisabled = firstName.trim().length === 0 || lastName.trim().length === 0

    function handleSave(event: MouseEvent<HTMLButtonElement>) {

        if (!customer) {
            console.error("No customer selected for saving.")
            return
        }

        const form = formRef.current

        if (!form?.checkValidity()) {
            event.preventDefault()
            form?.reportValidity()
            return
        }

        onSave({
            ...customer,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
        })

    }

    function handleClose() {
        onOpenChange(false);
    }

    return (
        <Dialog open={visible}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{actionLabel}: {customer?.firstName} {customer?.lastName}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? `Customer ID: ${customer?.id}. Edit this customer's details.`
                            : `Create a new customer.`}
                    </DialogDescription>
                </DialogHeader>

                <form ref={formRef} className="grid gap-4">
                    {isEditMode && (
                        <div className="grid gap-1">
                            <label className="text-sm font-medium" htmlFor="customer-id">
                                ID
                            </label>
                            <Input
                                id="customer-id"
                                type="text"
                                value={customer?.id.toString()}
                                readOnly
                                className="cursor-not-allowed"
                            />
                        </div>
                    )}

                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="customer-first-name">
                            First name
                        </label>
                        <Input
                            id="customer-first-name"
                            type="text"
                            value={firstName}
                            maxLength={50}
                            required
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label className="text-sm font-medium" htmlFor="customer-last-name">
                            Last name
                        </label>
                        <Input
                            id="customer-last-name"
                            type="text"
                            value={lastName}
                            maxLength={50}
                            required
                            onChange={(event) => setLastName(event.target.value)}
                        />
                    </div>

                    <DialogFooter className="mt-4" showCloseButton={false}>
                        <Button variant="outline" onClick={handleClose}>Close</Button>
                        <Button
                            type="button"
                            disabled={isSaveDisabled}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}