"use client";

import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import {
  CalendarIcon,
  Send,
  Wallet,
  CalendarDays
} from "lucide-react";

import { toast } from "sonner";

import {
  applyLeave,
  getLeaveTypes,
  getLeaveBalance,
} from "@/services/leaveService";

import { Spinner } from "@/components/ui/spinner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ApplyLeave() {

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [reason, setReason] = useState("");

  const days =
    fromDate && toDate
      ? differenceInDays(toDate, fromDate) + 1
      : 0;

  /* LOAD DATA */

  useEffect(() => {

    const load = async () => {

      try {

        const types = await getLeaveTypes();
        const balance = await getLeaveBalance();

        setLeaveTypes(types || []);
        setLeaveBalance(balance || {});

      } catch {

        toast.error("Failed to load data");

      } finally {

        setLoading(false);

      }

    };

    load();

  }, []);

  /* APPLY LEAVE */

  const submit = async () => {

    if (!leaveType || !fromDate || !toDate || !reason) {
      return toast.error("Fill all fields");
    }

    try {

      setSubmitting(true);

      await applyLeave({
        leave_type_id: Number(leaveType),
        from_date: format(fromDate, "yyyy-MM-dd"),
        to_date: format(toDate, "yyyy-MM-dd"),
        days,
        reason,
      });

      toast.success("Leave applied successfully");

      setLeaveType("");
      setFromDate(undefined);
      setToDate(undefined);
      setReason("");

    } catch {

      toast.error("Failed to apply leave");

    } finally {

      setSubmitting(false);

    }

  };

  /* PAGE LOADING */

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto space-y-6">

      {/* LEAVE BALANCE */}

      <Card>

        <CardHeader className="flex flex-row items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle>Leave Balance</CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            {Object.entries(leaveBalance).map(([key, value]) => (

              <div
                key={key}
                className="border rounded-lg p-4 text-center hover:shadow-sm transition"
              >

                <CalendarDays className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />

                <p className="text-xs uppercase text-muted-foreground">
                  {key}
                </p>

                <p className="text-xl font-bold">
                  {value}
                </p>

              </div>

            ))}

          </div>

        </CardContent>

      </Card>


      {/* APPLY LEAVE FORM */}

      <Card>

        <CardHeader className="flex flex-row items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          <CardTitle>Apply Leave</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Leave Type */}

          <Select
            value={leaveType}
            onValueChange={setLeaveType}
          >

            <SelectTrigger>
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>

            <SelectContent>

              {leaveTypes.map((t) => (

                <SelectItem
                  key={t.id}
                  value={t.id.toString()}
                >
                  {t.name}
                </SelectItem>

              ))}

            </SelectContent>

          </Select>


          {/* Dates */}

          <div className="grid grid-cols-2 gap-4">

            <Popover>

              <PopoverTrigger asChild>

                <Button
                  variant="outline"
                  className="justify-start"
                >

                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {fromDate
                    ? format(fromDate, "PPP")
                    : "From date"}

                </Button>

              </PopoverTrigger>

              <PopoverContent className="p-0">

                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />

              </PopoverContent>

            </Popover>


            <Popover>

              <PopoverTrigger asChild>

                <Button
                  variant="outline"
                  className="justify-start"
                >

                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {toDate
                    ? format(toDate, "PPP")
                    : "To date"}

                </Button>

              </PopoverTrigger>

              <PopoverContent className="p-0">

                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />

              </PopoverContent>

            </Popover>

          </div>


          {/* Days */}

          {days > 0 && (
            <p className="text-sm text-muted-foreground">
              Total days: <b>{days}</b>
            </p>
          )}


          {/* Reason */}

          <Textarea
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          />


          {/* APPLY BUTTON */}

          <Button
            onClick={submit}
            className="w-full"
            disabled={submitting}
          >

            {submitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Applying...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Apply Leave
              </>
            )}

          </Button>

        </CardContent>

      </Card>

    </div>

  );

}